import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { EcommerceOrder } from '../entities/ecommerce-order.entity';
import { EcommerceOrderItem } from '../entities/ecommerce-order-item.entity';
import { EcommerceCart } from '../entities/ecommerce-cart.entity';
import { EcommerceCartItem } from '../entities/ecommerce-cart-item.entity';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { OrderStatus, PaymentStatus } from '../entities/ecommerce-order.entity';
import { CartStatus } from '../entities/ecommerce-cart.entity';
import { User } from 'src/users/user.entity';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { PAYMENT_GATEWAY } from 'src/shared/constants';

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

interface PaymentInfo {
  cf_payment_id: string;
  payment_status: string;
  payment_group?: string;
}

@Injectable()
export class OrderService {
  private cashfree: Cashfree;
  private readonly gatewayAppId: string;
  private readonly gatewaySecretKey: string;
  private readonly gatewayMode: string;
  private readonly gatewayBaseUrl: string;

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
    this.gatewayAppId = process.env.CASHFREE_APP_ID!;
    this.gatewaySecretKey = process.env.CASHFREE_SECRET_KEY!;
    this.gatewayMode = process.env.CASHFREE_MODE!;

    if (!this.gatewayAppId || !this.gatewaySecretKey) {
      throw new BadRequestException('Cashfree credentials not configured');
    }

    this.gatewayBaseUrl =
      this.gatewayMode === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';

    this.cashfree = new Cashfree(
      this.gatewayMode === 'production'
        ? CFEnvironment.PRODUCTION
        : CFEnvironment.SANDBOX,
      this.gatewayAppId,
      this.gatewaySecretKey,
    );
  }

  private roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<EcommerceOrder> {
    // Get user's active cart
    const cart = await this.cartRepository.findOne({
      where: { user_id: userId, status: CartStatus.ACTIVE },
      relations: ['items', 'items.product', 'user'],
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let itemsToProcess = cart.items;

    if (createOrderDto.product_ids && createOrderDto.product_ids.length > 0) {
      itemsToProcess = cart.items.filter((item) => {
        const cartItemId = item.product_id || item.product?.id;
        return createOrderDto.product_ids!.includes(cartItemId);
      });

      if (itemsToProcess.length === 0) {
        throw new BadRequestException(
          'None of the selected products exist in your active cart',
        );
      }
    }

    const user = cart.user;
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const selectedCurrency = createOrderDto.currency || 'USD';

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(userId);
    let currencyInfo: CurrencyInfo;
    let orderCurrency: string;
    if (userCurrency) {
      currencyInfo = userCurrency;
      orderCurrency = userCurrency.code;
    } else {
      currencyInfo =
        await this.userPreferenceService.getCurrencyInfoByCode(
          selectedCurrency,
        );
      orderCurrency = selectedCurrency.toUpperCase();
    }

    let grossSubtotal = 0;
    let totalDiscountAmount = 0;

    for (const item of itemsToProcess) {
      const basePrice = Number(item.product.price);

      const rawConvertedBasePrice =
        currencyInfo.code === 'USD' ? basePrice : basePrice * currencyInfo.rate;

      const originalUnitPrice = this.roundCurrency(rawConvertedBasePrice);

      const discountPercent = Number(item.product.discount_percentage || 0);

      const discountedUnitPrice = this.roundCurrency(
        originalUnitPrice * (1 - discountPercent / 100),
      );

      const discountPerUnit = this.roundCurrency(
        originalUnitPrice - discountedUnitPrice,
      );

      grossSubtotal += originalUnitPrice * item.quantity;
      totalDiscountAmount += discountPerUnit * item.quantity;
    }

    const discountedSubTotal = grossSubtotal - totalDiscountAmount;

    if (isNaN(discountedSubTotal))
      throw new BadRequestException('Invalid cart amount');

    const isIndia = orderCurrency === 'INR';
    const threshold = isIndia ? 299 : 20;
    const deliveryFeeBase = isIndia ? 3 : 5;
    const serviceChargeBase = 1;

    const deliveryFee = discountedSubTotal >= threshold ? 0 : deliveryFeeBase;

    const taxAmount = discountedSubTotal * 0.02;
    const serviceCharge = serviceChargeBase;

    const finalTotal =
      discountedSubTotal + deliveryFee + taxAmount + serviceCharge;

    const roundedTotal = this.roundCurrency(finalTotal);
    const roundedNetSubtotal = this.roundCurrency(discountedSubTotal);
    const roundedShipping = this.roundCurrency(deliveryFee);
    const roundedTax = this.roundCurrency(taxAmount);
    const roundedDiscount = this.roundCurrency(totalDiscountAmount);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    // Create order
    const order = this.orderRepository.create({
      order_number: orderNumber,
      user_id: userId,
      status: OrderStatus.PENDING,
      payment_status: PaymentStatus.PENDING,
      subtotal: roundedNetSubtotal,
      discount_percentage: roundedDiscount,
      shipping_amount: roundedShipping,
      tax_amount: roundedTax,
      total_amount: roundedTotal,
      payment_gateway: PAYMENT_GATEWAY.CASHFREE,
      payment_mode: 'UNKNOWN',
      notes: createOrderDto.notes,
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems: EcommerceOrderItem[] = [];

    for (const item of itemsToProcess) {
      const basePrice = Number(item.product.price);
      const rawConvertedBasePrice =
        currencyInfo.code === 'USD' ? basePrice : basePrice * currencyInfo.rate;

      const originalUnitPrice = this.roundCurrency(rawConvertedBasePrice);
      const discountPercent = Number(item.product.discount_percentage || 0);
      const discountedUnitPrice = this.roundCurrency(
        originalUnitPrice * (1 - discountPercent / 100),
      );

      const discountPerUnit = this.roundCurrency(
        originalUnitPrice - discountedUnitPrice,
      );
      const totalLinePrice = discountedUnitPrice * item.quantity;
      const totalLineDiscount = discountPerUnit * item.quantity;

      const orderItem = this.orderItemRepository.create({
        order_id: savedOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: originalUnitPrice,
        total_price: totalLinePrice,
        discount_percentage: totalLineDiscount,
      });
      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);

    try {
      await this.createCashfreePaymentSession(
        savedOrder,
        user,
        orderNumber,
        createOrderDto,
        orderCurrency,
        roundedTotal,
      );

      return await this.findOne(savedOrder.id);
    } catch (cashfreeErr: unknown) {
      // Rollback on Cashfree failure
      await this.orderRepository.delete(savedOrder.id);

      console.error('Cashfree error:', cashfreeErr);

      let errorMessage = 'Unknown error';
      if (cashfreeErr instanceof Error) {
        errorMessage = cashfreeErr.message;
      } else if (
        typeof cashfreeErr === 'object' &&
        cashfreeErr !== null &&
        'response' in cashfreeErr
      ) {
        const resp = (
          cashfreeErr as { response?: { data?: { message?: string } } }
        ).response;
        if (resp?.data?.message) {
          errorMessage = resp.data.message;
        }
      }

      throw new BadRequestException(
        `Failed to initialize payment session: ${errorMessage}`,
      );
    }
  }

  private async createCashfreePaymentSession(
    savedOrder: EcommerceOrder,
    user: User,
    orderNumber: string,
    createOrderDto: CreateOrderDto,
    orderCurrency: string,
    finalAmount: number,
  ): Promise<void> {
    const cashfreeOrderRequest = {
      order_amount: finalAmount,
      order_currency: orderCurrency,
      order_id: orderNumber,
      customer_details: {
        customer_id: user.id,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone_number,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/order`,
      },
      order_note: createOrderDto.notes || '',
    };

    const cashfreeResponse =
      await this.cashfree.PGCreateOrder(cashfreeOrderRequest);

    const { payment_session_id, cf_order_id } = cashfreeResponse.data || {};
    savedOrder.cashfree_session_id = payment_session_id!;
    savedOrder.cfc_order_id = cf_order_id!;

    await this.orderRepository.save(savedOrder);
  }

  async findAll(userId: string): Promise<EcommerceOrder[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      relations: ['items', 'items.product', 'user'],
      order: { created_at: 'DESC' },
    });

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(userId);
    const displayCurrency = userCurrency?.symbol || '$';

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
        'order.cashfree_payment_id AS "cashfree_payment_id"',
        'COUNT(items.id) AS "items_count"',
      ])
      .addSelect('COALESCE(user.name, \'Unknown\') AS "user_name"')
      .groupBy(
        'order.id, order.order_number, order.status, order.payment_status, order.total_amount, order.payment_mode, order.created_at, order.cashfree_payment_id, user.name',
      )
      .orderBy('order.created_at', 'DESC');

    const results = await queryBuilder.getRawMany();
    return results;
  }

  async findOne(id: string): Promise<EcommerceOrder> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(order.user_id);
    const displayCurrency = userCurrency?.symbol || '$';

    return {
      ...order,
      display_currency: displayCurrency,
    } as unknown as EcommerceOrder;
  }

  async getOrdersByUser(userId: string): Promise<EcommerceOrder[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      relations: ['items', 'items.product', 'user'],
      order: { created_at: 'DESC' },
    });

    if (orders.length === 0) {
      return [];
    }

    const userCurrency =
      await this.userPreferenceService.getUserPreferredCurrency(userId);
    let targetInfo: CurrencyInfo;
    if (!userCurrency) {
      targetInfo = { code: 'USD', symbol: '$', rate: 1 };
    } else {
      targetInfo = userCurrency;
    }

    const origCurrency =
      await this.userPreferenceService.getCurrencyInfoByCode('INR');

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
    const order = await this.orderRepository.findOne({
      where: { order_number: orderNumber },
      relations: ['items', 'items.product', 'user'],
    });

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

  async updatePaymentStatus(orderId: string): Promise<EcommerceOrder> {
    const order = await this.findOne(orderId);
    if (order.payment_status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment already processed');
    }

    let successfulPayment: PaymentInfo | null = null;

    try {
      const paymentsUrl = `${this.gatewayBaseUrl}/orders/${order.order_number}/payments`;
      const paymentsResponse = await firstValueFrom(
        this.httpService.get<PaymentInfo[]>(paymentsUrl, {
          headers: {
            'x-api-version': '2025-01-01',
            'x-client-id': this.gatewayAppId,
            'x-client-secret': this.gatewaySecretKey,
          },
        }),
      );
      const payments: PaymentInfo[] = paymentsResponse.data;

      if (!Array.isArray(payments) || payments.length === 0) {
        throw new BadRequestException('No payments found for this order');
      }

      successfulPayment =
        payments.find((p) => p.payment_status === 'SUCCESS') || null;

      if (!successfulPayment) {
        throw new BadRequestException(
          'No successful payment found for this order',
        );
      }
    } catch (fetchError: unknown) {
      console.error('Error fetching payments from Cashfree:', fetchError);
      throw new BadRequestException('Failed to verify payment status');
    }

    order.payment_status = PaymentStatus.PAID;
    order.cashfree_payment_id = successfulPayment.cf_payment_id;

    if (successfulPayment.payment_group) {
      order.payment_mode = successfulPayment.payment_group;
    }

    const orderProductIds = order.items.map((item) => item.product_id);
    const cart = await this.cartRepository.findOne({
      where: {
        user_id: order.user.id,
        status: CartStatus.ACTIVE,
      },
      relations: ['items', 'items.product'],
    });

    if (cart && cart.items.length > 0) {
      const itemsToRemove = cart.items.filter((item) => {
        const cartItemId = item.product_id || item.product?.id;
        return orderProductIds.includes(cartItemId);
      });

      if (itemsToRemove.length > 0) {
        await this.cartItemRepository.delete(itemsToRemove.map((i) => i.id));

        const remainingItemsCount = cart.items.length - itemsToRemove.length;

        if (remainingItemsCount <= 0) {
          cart.status = CartStatus.CHECKED_OUT;
          cart.items = [];
          await this.cartRepository.save(cart);
        }
      }
    }

    return this.orderRepository.save(order);
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
