import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EcommerceOrder } from '../entities/ecommerce-order.entity';
import { EcommerceOrderItem } from '../entities/ecommerce-order-item.entity';
import { EcommerceCart } from '../entities/ecommerce-cart.entity';
import { EcommerceCartItem } from '../entities/ecommerce-cart-item.entity';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { OrderStatus, PaymentStatus } from '../entities/ecommerce-order.entity';
import { CartStatus } from '../entities/ecommerce-cart.entity';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { DEFAULT_CURRENCY, PAYMENT_GATEWAY } from '../../shared/constants.js';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  scope: string;
  nonce: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
      }>;
    };
  }>;
}

interface PayPalHttpError {
  response: {
    data: {
      message?: string;
      details?: Array<{ description?: string }>;
    };
  };
}

@Injectable()
export class OrderService {
  private readonly clientId: string;
  private readonly secretKey: string;
  private readonly mode: string;
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(EcommerceOrder)
    private readonly orderRepository: Repository<EcommerceOrder>,
    @InjectRepository(EcommerceOrderItem)
    private readonly orderItemRepository: Repository<EcommerceOrderItem>,
    @InjectRepository(EcommerceCart)
    private readonly cartRepository: Repository<EcommerceCart>,
    @InjectRepository(EcommerceCartItem)
    private readonly cartItemRepository: Repository<EcommerceCartItem>,
    private readonly userPreferenceService: UserPreferencesService,
    private readonly httpService: HttpService,
  ) {
    this.clientId = process.env.PAYPAL_CLIENT_ID!;
    this.secretKey = process.env.PAYPAL_SECRET_KEY!;
    this.mode = process.env.PAYPAL_MODE || 'sandbox';

    if (!this.clientId || !this.secretKey) {
      throw new BadRequestException('PayPal credentials not configured');
    }

    this.baseUrl =
      this.mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private getThresholdAndFees(currency: string) {
    if (currency === 'INR') {
      return { threshold: 299, deliveryFee: 3, serviceCharge: 1 };
    }
    return { threshold: 20, deliveryFee: 5, serviceCharge: 1 };
  }

  private generateOrderNumber(): string {
    // last 3 digits of timestamp
    const timeBasedSuffix = Date.now().toString().slice(-3);

    // 3-character alphanumeric (A-Z, 0-9)
    const randomAlphaNumeric = Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase();

    return `ORD-${timeBasedSuffix}-${randomAlphaNumeric}`;
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.secretKey}`).toString(
      'base64',
    );
    const response = await firstValueFrom(
      this.httpService.post<PayPalAccessTokenResponse>(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    return response.data.access_token;
  }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<EcommerceOrder> {
    let savedOrder: EcommerceOrder | null = null;

    try {
      // Get user's active cart
      const cart = await this.cartRepository.findOne({
        where: { user_id: userId, status: CartStatus.ACTIVE },
        relations: ['items', 'items.product', 'user'],
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const itemsToProcess = createOrderDto.product_ids?.length
        ? cart.items.filter((item) =>
            createOrderDto.product_ids!.includes(
              item.product_id || item.product?.id,
            ),
          )
        : cart.items;

      if (!itemsToProcess.length) {
        throw new BadRequestException('No valid items to order');
      }

      const userCurrencyInfo =
        await this.userPreferenceService.getUserPreferredCurrency(userId);

      const sourceInfo: CurrencyInfo = userCurrencyInfo || DEFAULT_CURRENCY;
      const sourceCurrency = sourceInfo.code;

      if (!sourceInfo.rate) {
        throw new BadRequestException(
          `Currency rate missing for ${sourceCurrency}`,
        );
      }

      let subtotalLocal = 0;
      let totalDiscountLocal = 0;

      for (const item of itemsToProcess) {
        const basePrice = Number(item.product?.price || 0);
        const localPrice = this.roundCurrency(basePrice * sourceInfo.rate);
        const discountPerc = Number(item.product?.discount_percentage || 0);
        const discountPerUnitLocal = this.roundCurrency(
          localPrice * (discountPerc / 100),
        );
        const discountedUnitLocal = this.roundCurrency(
          localPrice - discountPerUnitLocal,
        );

        if (isNaN(discountedUnitLocal) || localPrice <= 0) {
          throw new BadRequestException('Invalid cart item price');
        }

        subtotalLocal += localPrice * item.quantity;
        totalDiscountLocal += discountPerUnitLocal * item.quantity;
      }

      const discountedSubtotalLocal = this.roundCurrency(
        subtotalLocal - totalDiscountLocal,
      );

      if (isNaN(discountedSubtotalLocal) || discountedSubtotalLocal < 0) {
        throw new BadRequestException('Invalid order amount');
      }

      const {
        threshold,
        deliveryFee: deliveryBaseLocal,
        serviceCharge: serviceBaseLocal,
      } = this.getThresholdAndFees(sourceCurrency);

      const deliveryFeeLocal =
        discountedSubtotalLocal >= threshold ? 0 : deliveryBaseLocal;
      const taxesLocal = this.roundCurrency(discountedSubtotalLocal * 0.02);
      const serviceChargeLocal = serviceBaseLocal;

      const finalLocalTotal = this.roundCurrency(
        discountedSubtotalLocal +
          deliveryFeeLocal +
          taxesLocal +
          serviceChargeLocal,
      );

      const finalUSDTotal = this.roundCurrency(
        finalLocalTotal / sourceInfo.rate,
      );

      // Generate order number
      const orderNumber = this.generateOrderNumber();

      // Create order
      const order = this.orderRepository.create({
        order_number: orderNumber,
        user_id: userId,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        total_amount: finalUSDTotal,
        payment_gateway: PAYMENT_GATEWAY.PAYPAL,
        payment_mode: 'UNKNOWN',
        notes: createOrderDto.notes,
      });

      savedOrder = await this.orderRepository.save(order);

      const orderItems = itemsToProcess.map((item) => {
        const basePrice = Number(item.product?.price || 0);
        const localPrice = this.roundCurrency(basePrice * sourceInfo.rate);
        const discountPerc = Number(item.product?.discount_percentage || 0);
        const discountPerUnitLocal = this.roundCurrency(
          localPrice * (discountPerc / 100),
        );
        const discountedUnitLocal = this.roundCurrency(
          localPrice - discountPerUnitLocal,
        );
        const discountedUnitUSD = this.roundCurrency(
          discountedUnitLocal / sourceInfo.rate,
        );

        return this.orderItemRepository.create({
          order_id: savedOrder!.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: discountedUnitUSD,
          total_price: this.roundCurrency(discountedUnitUSD * item.quantity),
          discount_percentage: discountPerc,
        });
      });

      await this.orderItemRepository.save(orderItems);

      await this.createPayPalPaymentSession(
        savedOrder,
        orderNumber,
        finalUSDTotal,
      );

      return this.findOne(savedOrder.id);
    } catch (paypalErr: unknown) {
      // Rollback on PayPal failure
      if (savedOrder?.id) {
        await this.orderRepository.delete(savedOrder.id);
      }

      console.error('PayPal error:', paypalErr);

      let errorMessage = 'Unknown PayPal error';

      if (paypalErr instanceof Error) {
        errorMessage = paypalErr.message;
      } else if (
        paypalErr &&
        typeof paypalErr === 'object' &&
        'response' in paypalErr
      ) {
        const httpError = paypalErr as PayPalHttpError;
        const responseData = httpError.response?.data;
        if (responseData && typeof responseData === 'object') {
          errorMessage =
            responseData.message ||
            responseData.details?.[0]?.description ||
            errorMessage;
        }
      }

      throw new BadRequestException(
        `Failed to initialize payment session: ${errorMessage}`,
      );
    }
  }

  private async createPayPalPaymentSession(
    order: EcommerceOrder,
    orderNumber: string,
    usdAmount: number,
  ): Promise<void> {
    const token = await this.getAccessToken();

    const paypalOrderRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: usdAmount.toFixed(2),
          },
          description: `Order ${orderNumber}`,
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/order`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    };

    const response = await firstValueFrom(
      this.httpService.post<PayPalOrderResponse>(
        `${this.baseUrl}/v2/checkout/orders`,
        paypalOrderRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': orderNumber,
          },
        },
      ),
    );

    if (response.data.status !== 'CREATED') {
      throw new Error('PayPal order creation failed');
    }

    order.gateway_order_id = response.data.id;
    await this.orderRepository.save(order);
  }

  async findAll(userId: string): Promise<EcommerceOrder[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      relations: ['items', 'items.product', 'user'],
      order: { created_at: 'DESC' },
    });

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(userId);
    const displayCurrency = userCurrency?.symbol || DEFAULT_CURRENCY.symbol;

    return orders.map((order) => ({
      ...order,
      display_currency: displayCurrency,
    })) as unknown as EcommerceOrder[];
  }

  async getAllOrders(): Promise<any[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .leftJoin('order.items', 'items')
      .select([
        'order.id AS "id"',
        'order.order_number AS "order_number"',
        'order.status AS "status"',
        'order.payment_status AS "payment_status"',
        'order.total_amount AS "total_amount"',
        'order.payment_mode AS "payment_mode"',
        'order.created_at AS "created_at"',
        'order.gateway_transaction_id AS "gateway_transaction_id"',
        'COUNT(items.id) AS "items_count"',
      ])
      .addSelect('COALESCE(user.name, \'Unknown\') AS "user_name"')
      .groupBy(
        'order.id, order.order_number, order.status, order.payment_status, order.total_amount, order.payment_mode, order.created_at, order.gateway_transaction_id, user.name',
      )
      .orderBy('order.created_at', 'DESC');

    const results = await queryBuilder.getRawMany();
    return results;
  }

  async findOne(id: string): Promise<EcommerceOrder> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .select('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoin('order.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.email', 'user.phone_number'])
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(order.user_id);
    const displayCurrency = userCurrency?.symbol || DEFAULT_CURRENCY.symbol;

    return {
      ...order,
      display_currency: displayCurrency,
    } as unknown as EcommerceOrder;
  }

  async getOrdersByUser(userId: string): Promise<EcommerceOrder[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' },
    });

    if (orders.length === 0) {
      return [];
    }

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(userId);
    let targetInfo: CurrencyInfo;
    if (!userCurrency) {
      targetInfo = {
        code: DEFAULT_CURRENCY.code,
        symbol: DEFAULT_CURRENCY.symbol,
        rate: DEFAULT_CURRENCY.rate,
      };
    } else {
      targetInfo = userCurrency;
    }

    const origCurrency =
      await this.userPreferenceService.getCurrencyInfoByCode('USD');

    if (!origCurrency) {
      return orders.map((order) => ({
        ...order,
        display_currency: targetInfo.symbol,
      })) as unknown as EcommerceOrder[];
    }

    const origRate = origCurrency.rate;
    const conversionFactor = targetInfo.rate / origRate;

    const convertedOrders = orders.map((order) => ({
      ...order,
      total_amount: this.roundCurrency(order.total_amount * conversionFactor),
      display_currency: targetInfo.symbol,
    })) as unknown as EcommerceOrder[];

    return convertedOrders;
  }

  async findByOrderNumber(orderNumber: string): Promise<EcommerceOrder> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .select('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoin('order.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.email', 'user.phone_number'])
      .where('order.order_number = :orderNumber', { orderNumber })
      .getOne();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    comment?: string,
  ): Promise<EcommerceOrder> {
    const order = await this.findOne(id);
    order.status = status;

    if (comment) {
      order.comment = comment;
    }

    return this.orderRepository.save(order);
  }

  async processOrderPayment(
    orderId: string,
    paypalOrderId?: string,
  ): Promise<EcommerceOrder> {
    const order = await this.findOne(orderId);

    if (order.payment_status === PaymentStatus.PAID) {
      await this.cleanupCartItems(order);
      return order;
    }

    if (order.payment_status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        'Payment already processed or invalid status',
      );
    }

    if (paypalOrderId && order.gateway_order_id !== paypalOrderId) {
      throw new BadRequestException('Invalid PayPal order ID');
    }

    const captureData = await this.capturePayPalPayment(order);
    this.applyPayPalToOrder(order, captureData);

    await this.cleanupCartItems(order);

    return this.orderRepository.save(order);
  }

  private async capturePayPalPayment(
    order: EcommerceOrder,
  ): Promise<PayPalCaptureResponse> {
    try {
      const token = await this.getAccessToken();

      const captureResponse = await firstValueFrom(
        this.httpService.post<PayPalCaptureResponse>(
          `${this.baseUrl}/v2/checkout/orders/${order.gateway_order_id}/capture`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const captureData = captureResponse.data;

      if (captureData.status !== 'COMPLETED') {
        throw new BadRequestException('PayPal capture failed');
      }

      return captureData;
    } catch (captureError: unknown) {
      console.error('Error capturing PayPal payment:', captureError);
      throw new BadRequestException('Failed to capture payment');
    }
  }

  private applyPayPalToOrder(
    order: EcommerceOrder,
    captureData: PayPalCaptureResponse,
  ): void {
    order.payment_status = PaymentStatus.PAID;
    order.gateway_transaction_id =
      captureData.purchase_units[0].payments.captures[0].id;
    order.payment_mode = PAYMENT_GATEWAY.PAYPAL;
  }

  private async cleanupCartItems(order: EcommerceOrder): Promise<void> {
    const orderProductIds = order.items.map((item) => item.product_id);

    const cart = await this.cartRepository.findOne({
      where: {
        user_id: order.user.id,
        status: CartStatus.ACTIVE,
      },
      relations: ['items', 'items.product'],
    });

    if (!cart || cart.items.length === 0) return;

    const itemsToRemove = cart.items.filter((item) => {
      const cartItemId = item.product_id || item.product?.id;
      return orderProductIds.includes(cartItemId);
    });

    if (itemsToRemove.length === 0) return;

    await this.cartItemRepository.delete(itemsToRemove.map((i) => i.id));

    const remainingItemsCount = cart.items.length - itemsToRemove.length;
    if (remainingItemsCount <= 0) {
      cart.status = CartStatus.CHECKED_OUT;
      cart.items = [];
      await this.cartRepository.save(cart);
    }
  }

  async cancelOrder(id: string): Promise<EcommerceOrder> {
    const order = await this.findOne(id);

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException('Cannot cancel this order');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }
}
