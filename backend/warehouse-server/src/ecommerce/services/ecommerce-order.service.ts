import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { DEFAULT_CURRENCY, PAYMENT_GATEWAY } from '../../shared/constants.js';
import { DeliveryFeeService } from 'src/shared/get-delivery-fee.service';
import {
  EcommercePayment,
  Status,
} from '../entities/ecommerce-payments.entity';
import { EcommerceOrderReference } from '../entities/ecommerce-order-references.entity';
import {
  EcommerceUserItem,
  UserItemStatus,
} from '../entities/ecommerce-user-items.entity';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';

export interface OrderWithDetails extends EcommercePayment {
  total_amount: number;
  display_currency: string;
}

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
  payment_source?: {
    paypal?: {
      email_address?: string;
      account_id?: string;
    };
    card?: {
      brand?: string;
      last_digits?: string;
    };
  };
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
    @InjectRepository(EcommercePayment)
    private readonly paymentRepository: Repository<EcommercePayment>,
    @InjectRepository(EcommerceOrderReference)
    private readonly orderReferenceRepository: Repository<EcommerceOrderReference>,
    @InjectRepository(EcommerceUserItem)
    private readonly userItemRepository: Repository<EcommerceUserItem>,
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    private readonly userPreferenceService: UserPreferencesService,
    private readonly httpService: HttpService,
    private readonly deliveryFeeService: DeliveryFeeService,
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

  private generateOrderNumber(): string {
    // Last 6 digits of epoch milliseconds
    const timeBasedSuffix = (Date.now() % 1_000_000)
      .toString()
      .padStart(6, '0');

    // 4-character alphanumeric (A-Z, 0-9)
    const randomAlphaNumeric = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    return `ORD-${timeBasedSuffix}-${randomAlphaNumeric}`;
  }

  private async calculateOrderPricing(
    items: EcommerceUserItem[],
    currencyInfo: CurrencyInfo,
    countryCode?: string,
  ) {
    const { rate } = currencyInfo;
    let subtotalLocal = 0;
    let totalDeliveryUSD = 0;

    // Calculate details for each item
    const itemDetails = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id },
          relations: ['measurement'],
        });

        const basePrice = Number(product?.price || 0);
        const localPrice = this.roundCurrency(basePrice * rate);

        // Accumulate totals for this item
        const itemSubtotalLocal = localPrice * item.quantity;
        const itemTotalUSD = this.roundCurrency(itemSubtotalLocal / rate);

        const weightPerUnit = this.deliveryFeeService.getWeightInKg(
          Number(product?.unit_value ?? 0),
          product?.measurement?.label ?? 'kg',
        );
        const totalWeight = weightPerUnit * item.quantity;
        const deliveryUSD = await this.deliveryFeeService.getDeliveryFee(
          totalWeight,
          countryCode!,
        );
        totalDeliveryUSD += deliveryUSD;

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          unitPriceUSD: basePrice,
          totalUSD: itemTotalUSD,
          subtotalLocal: itemSubtotalLocal,
          deliveryUSD,
        };
      }),
    );

    // Aggregate totals
    for (const detail of itemDetails) {
      subtotalLocal += detail.subtotalLocal;
    }

    const finalLocalTotal = this.roundCurrency(subtotalLocal);

    const finalUSDTotal =
      this.roundCurrency(finalLocalTotal / rate) + totalDeliveryUSD;

    return {
      finalUSDTotal,
      itemDetails,
    };
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

  private async decreaseProductStock(payment: EcommercePayment): Promise<void> {
    for (const item of payment.items) {
      const product = item.product;
      const quantity = item.user_item?.quantity || 0;

      if (!product) continue;

      if (product.stock_quantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.id}`,
        );
      }

      product.stock_quantity -= quantity;
      await this.productRepository.save(product);
    }
  }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
    countryCode?: string,
  ): Promise<OrderWithDetails> {
    let savedPayment: EcommercePayment | null = null;

    try {
      if (!userId) {
        throw new BadRequestException('User not found');
      }

      const cartItems = await this.userItemRepository.find({
        where: { user_id: userId, status: UserItemStatus.CART },
      });

      if (!cartItems || cartItems.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      if (!createOrderDto.product_ids.length) {
        throw new BadRequestException('No product IDs provided');
      }

      const placeOrderProducts = cartItems.filter((item) =>
        createOrderDto.product_ids.includes(item.product_id),
      );

      if (!placeOrderProducts?.length) {
        throw new BadRequestException('No valid products to order');
      }

      const userCurrencyInfo =
        await this.userPreferenceService.getUserPreferredCurrency(userId);

      const sourceInfo: CurrencyInfo = userCurrencyInfo || DEFAULT_CURRENCY;

      if (!sourceInfo?.rate) {
        throw new BadRequestException(
          `Currency rate missing for ${sourceInfo.code}`,
        );
      }

      const { finalUSDTotal, itemDetails } = await this.calculateOrderPricing(
        placeOrderProducts,
        sourceInfo,
        countryCode,
      );

      // Generate order number
      const orderNumber = this.generateOrderNumber();
      // Create order
      const payment = this.paymentRepository.create({
        order_number: orderNumber,
        status: Status.PENDING,
        payment_gateway: PAYMENT_GATEWAY.PAYPAL,
        payment_mode: 'UNKNOWN',
      });

      //TODO P0: Create a seperate service file called payment and in this file only order related one, and payment and those code and calculation will be in those files
      //TODO P0: Below code is needs to be restructure, please think and restructure it
      //TODO P0: I couldn't able to see transactions, here, we need to start db transaction and once payment is saved then only commit the order related transactions
      savedPayment = await this.paymentRepository.save(payment);
      const orderReferences = itemDetails.map((detail) => {
        const correspondingUserItem = placeOrderProducts.find(
          (i) => i.product_id === detail.product_id,
        )!;
        return this.orderReferenceRepository.create({
          payment_id: savedPayment!.id,
          user_item_id: correspondingUserItem.id,
          product_id: detail.product_id,
        });
      });

      await this.orderReferenceRepository.save(orderReferences);

      await this.createPayPalPaymentSession(
        savedPayment,
        orderNumber,
        finalUSDTotal,
      );

      return this.findOne(savedPayment.id);
    } catch (paypalErr: unknown) {
      if (savedPayment?.id) {
        await this.paymentRepository.delete(savedPayment.id);
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
    payment: EcommercePayment,
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

    payment.gateway_order_id = response.data.id;
    await this.paymentRepository.save(payment);
  }

  async findAll(userId: string): Promise<OrderWithDetails[]> {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.items', 'ref')
      .innerJoinAndSelect('ref.user_item', 'user_item')
      .innerJoinAndSelect('ref.product', 'product')
      .where('user_item.user_id = :userId', { userId })
      .andWhere('user_item.status = :itemStatus', {
        itemStatus: UserItemStatus.ORDERED,
      })
      .andWhere('payment.status = :paymentStatus', {
        paymentStatus: Status.PAID,
      })
      .orderBy('payment.created_at', 'DESC')
      .getMany();

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(userId);
    const displayCurrency = userCurrency?.symbol || DEFAULT_CURRENCY.symbol;

    return payments.map((payment) => ({
      ...payment,
      items: payment.items,
      total_amount: payment.items.reduce(
        (sum, ref) =>
          sum + Number(ref.product.price) * (ref.user_item?.quantity || 0),
        0,
      ),
      display_currency: displayCurrency,
    })) as OrderWithDetails[];
  }

  async getAllOrders(): Promise<any[]> {
    return this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.items', 'ref')
      .innerJoin('ref.user_item', 'user_item')
      .innerJoin('ref.product', 'product')
      .innerJoin('users', 'u', 'u.id::text = user_item.user_id')
      .select([
        'payment.id AS "id"',
        'payment.order_number AS "order_number"',
        'payment.status AS "status"',
        'payment.payment_mode AS "payment_mode"',
        'payment.created_at AS "created_at"',
        'payment.gateway_transaction_id AS "gateway_transaction_id"',
        'COUNT(ref.id) AS "items_count"',
        'SUM(product.price * user_item.quantity) AS "total_amount"',
        'user_item.user_id AS "user_id"',
        'u.name AS "user_name"',
      ])
      .where('payment.status = :paymentStatus', {
        paymentStatus: Status.PAID,
      })
      .andWhere('user_item.status = :itemStatus', {
        itemStatus: UserItemStatus.ORDERED,
      })
      .groupBy(
        `
        payment.id,
        payment.order_number,
        payment.status,
        payment.payment_mode,
        payment.created_at,
        payment.gateway_transaction_id,
        user_item.user_id,
        u.name
        `,
      )
      .orderBy('payment.created_at', 'DESC')
      .getRawMany();
  }

  async findOne(id: string): Promise<OrderWithDetails> {
    const payment = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.items', 'ref')
      .innerJoinAndSelect('ref.user_item', 'user_item')
      .innerJoinAndSelect('ref.product', 'product')
      .where('payment.id = :id', { id })
      .getOne();

    if (!payment) {
      throw new NotFoundException('Order not found');
    }

    const userId = payment.items[0]?.user_item?.user_id;

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(userId);
    const displayCurrency = userCurrency?.symbol || DEFAULT_CURRENCY.symbol;

    const total_amount = payment.items.reduce(
      (sum, ref) =>
        sum + Number(ref.product.price) * (ref.user_item?.quantity || 0),
      0,
    );

    return {
      ...payment,
      items: payment.items,
      total_amount,
      display_currency: displayCurrency,
    } as OrderWithDetails;
  }

  async getOrdersByUser(userId: string): Promise<OrderWithDetails[]> {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.items', 'ref')
      .innerJoinAndSelect('ref.user_item', 'user_item')
      .innerJoinAndSelect('ref.product', 'product')
      .where('user_item.user_id = :userId', { userId })
      .andWhere('user_item.status = :itemStatus', {
        itemStatus: UserItemStatus.ORDERED,
      })
      .andWhere('payment.status = :paymentStatus', {
        paymentStatus: Status.PAID,
      })
      .orderBy('payment.created_at', 'DESC')
      .getMany();

    if (!payments.length) return [];

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(userId);

    const targetInfo: CurrencyInfo = userCurrency || DEFAULT_CURRENCY;

    const origCurrency =
      await this.userPreferenceService.getCurrencyInfoByCode('USD');

    const conversionFactor = origCurrency
      ? targetInfo.rate / origCurrency.rate
      : 1;

    return payments.map((payment) => ({
      ...payment,
      items: payment.items,
      total_amount: this.roundCurrency(
        payment.items.reduce(
          (sum, ref) =>
            sum + Number(ref.product.price) * (ref.user_item?.quantity || 0),
          0,
        ) * conversionFactor,
      ),
      display_currency: targetInfo.symbol,
    })) as OrderWithDetails[];
  }

  async findByOrderNumber(orderNumber: string): Promise<EcommercePayment> {
    const payment = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment')
      .leftJoinAndSelect('payment.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('items.user_item', 'user_item')
      .where('payment.order_number = :orderNumber', { orderNumber })
      .getOne();

    if (!payment) {
      throw new NotFoundException('Order not found');
    }

    return payment;
  }

  async updateOrderStatus(
    id: string,
    status: Status,
    comment?: string,
  ): Promise<EcommercePayment> {
    const payment = (await this.findOne(id)) as EcommercePayment;
    payment.status = status;

    return this.paymentRepository.save(payment);
  }

  async processOrderPayment(
    orderId: string,
    paypalOrderId?: string,
  ): Promise<EcommercePayment> {
    const payment = (await this.findOne(orderId)) as EcommercePayment;

    if (payment.status === Status.PAID) {
      return payment;
    }

    if (payment.status !== Status.PENDING) {
      throw new BadRequestException(
        'Payment already processed or invalid status',
      );
    }

    if (paypalOrderId && payment.gateway_order_id !== paypalOrderId) {
      throw new BadRequestException('Invalid PayPal order ID');
    }

    const captureData = await this.capturePayPalPayment(payment);
    this.applyPayPalToOrder(payment, captureData);

    await this.decreaseProductStock(payment);

    const userItemIds = payment.items.map((item) => item.user_item_id);

    await this.userItemRepository.update(
      { id: In(userItemIds) },
      { status: UserItemStatus.ORDERED },
    );

    return this.paymentRepository.save(payment);
  }

  private async capturePayPalPayment(
    payment: EcommercePayment,
  ): Promise<PayPalCaptureResponse> {
    try {
      const token = await this.getAccessToken();

      const captureResponse = await firstValueFrom(
        this.httpService.post<PayPalCaptureResponse>(
          `${this.baseUrl}/v2/checkout/orders/${payment.gateway_order_id}/capture`,
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
    payment: EcommercePayment,
    captureData: PayPalCaptureResponse,
  ): void {
    const capture = captureData.purchase_units[0].payments.captures[0];

    payment.status = Status.PAID;
    payment.gateway_transaction_id = capture.id;

    const paymentSource = captureData.payment_source;

    if (paymentSource?.paypal) {
      payment.payment_mode = 'PAYPAL_BALANCE';
    } else if (paymentSource?.card) {
      payment.payment_mode = `CARD_${paymentSource.card.brand ?? 'UNKNOWN'}`;
    } else {
      payment.payment_mode = 'UNKNOWN';
    }
  }

  async cancelOrder(id: string): Promise<EcommercePayment> {
    const payment = (await this.findOne(id)) as EcommercePayment;

    if (
      payment.status === Status.DELIVERED ||
      payment.status === Status.CANCELLED
    ) {
      throw new BadRequestException('Cannot cancel this order');
    }

    payment.status = Status.CANCELLED;
    return this.paymentRepository.save(payment);
  }
}
