import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, In, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { DEFAULT_CURRENCY, PAYMENT_GATEWAY } from '../../shared/constants.js';
import { Status } from '../entities/ecommerce-payments.entity';
import { EcommercePayment } from '../entities/ecommerce-payments.entity';
import { EcommerceOrderReference } from '../entities/ecommerce-order-references.entity';
import {
  EcommerceUserProductStatus,
  UserProductStatus,
} from '../entities/ecommerce_user_products_status.entity';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { PaymentService } from './payment.service';
import { CartService } from './ecommerce-cart.service';
import { EcommerceUserDeliverySelection } from '../entities/ecommerce_user_delivery_selections.entity';

export interface OrderWithDetails extends EcommercePayment {
  total_amount: number;
  display_currency: string;
}

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(EcommercePayment)
    private readonly paymentRepository: Repository<EcommercePayment>,
    @InjectRepository(EcommerceOrderReference)
    private readonly orderReferenceRepository: Repository<EcommerceOrderReference>,
    @InjectRepository(EcommerceUserProductStatus)
    private readonly userItemRepository: Repository<EcommerceUserProductStatus>,
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    @InjectRepository(EcommerceUserDeliverySelection)
    private readonly deliverySelectionRepository: Repository<EcommerceUserDeliverySelection>,
    private readonly userPreferenceService: UserPreferencesService,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

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
    items: EcommerceUserProductStatus[],
    currencyInfo: CurrencyInfo,
    deliveryFeeUSD: number,
  ) {
    const { rate } = currencyInfo;
    let subtotalLocal = 0;

    // Calculate details for each item
    const itemDetails = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id },
          relations: ['measurement'],
        });

        const basePrice = Number(product?.price || 0);
        const discountPercentage = Number(product?.discount_percentage || 0);

        const discountPerUnitUSD = basePrice * (discountPercentage / 100);
        const discountedUnitPriceUSD = basePrice - discountPerUnitUSD;

        const itemTotalPaidUSDRaw = discountedUnitPriceUSD * item.quantity;

        const itemOriginalTotalUSDRaw = basePrice * item.quantity;

        const localPrice = this.roundCurrency(basePrice * rate);
        const localDiscountedPrice = this.roundCurrency(
          discountedUnitPriceUSD * rate,
        );
        const itemSubtotalLocal = localPrice * item.quantity;

        const itemTotalUSDRounded = this.roundCurrency(itemTotalPaidUSDRaw);

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          unitPriceUSD: basePrice,
          totalUSD: itemTotalUSDRounded,
          rawTotalUSD: itemTotalPaidUSDRaw,
          subtotalLocal: itemSubtotalLocal,
          discountUSD: discountPerUnitUSD * item.quantity
        };
      }),
    );

    // Aggregate totals
    let totalItemsPaidUSDRaw = 0;
    for (const detail of itemDetails) {
      subtotalLocal += detail.subtotalLocal;
      totalItemsPaidUSDRaw += detail.rawTotalUSD;
    }

    const roundedDeliveryFeeUSD = this.roundCurrency(deliveryFeeUSD);

    const finalUSDTotal = this.roundCurrency(
      totalItemsPaidUSDRaw + roundedDeliveryFeeUSD,
    );

    return {
      finalUSDTotal,
      itemDetails,
    };
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
  ): Promise<OrderWithDetails> {
    let savedPayment: EcommercePayment | null = null;

    if (!userId) {
      throw new BadRequestException('User not found');
    }

    const cartItems = await this.userItemRepository.find({
      where: { user_id: userId, status: UserProductStatus.CART },
    });

    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    const placeOrderProducts = cartItems.filter((item) =>
      createOrderDto.product_ids.includes(item.product_id),
    );

    if (!placeOrderProducts.length) {
      throw new BadRequestException('No valid products to order');
    }

    const products = await this.productRepository.find({
      where: { id: In(placeOrderProducts.map((item) => item.product_id)) },
    });

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    for (const item of placeOrderProducts) {
      const product = productMap.get(item.product_id);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      if (product.stock_quantity <= 0) {
        throw new BadRequestException(
          `Product ${product.id} is not available in stock`,
        );
      }

      item.quantity = Math.min(item.quantity, product.stock_quantity);
    }

    const userCurrencyInfo =
      await this.userPreferenceService.getUserPreferredCurrency(userId);

    const sourceInfo = userCurrencyInfo || DEFAULT_CURRENCY;

    const selectedDelivery =
      await this.cartService.getSelectedDeliveryOption(userId);

    const deliveryFeeUSD = selectedDelivery
      ? Number(selectedDelivery.total_amount)
      : 0;

    const { finalUSDTotal, itemDetails } = await this.calculateOrderPricing(
      placeOrderProducts,
      sourceInfo,
      deliveryFeeUSD,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      savedPayment = await queryRunner.manager.save(payment);

      for (const item of placeOrderProducts) {
        const product = await queryRunner.manager.findOne(EcommerceProduct, {
          where: { id: item.product_id },
        });

        if (!product || product.stock_quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${item.product_id}`,
          );
        }
      }

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

      await queryRunner.manager.save(orderReferences);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.paymentService.createPayPalPaymentSession(
      savedPayment,
      orderNumber,
      finalUSDTotal,
    );

    return this.findOne(savedPayment.id);
  }

  async findAll(userId: string): Promise<OrderWithDetails[]> {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.items', 'ref')
      .innerJoinAndSelect('ref.user_item', 'user_item')
      .innerJoinAndSelect('ref.product', 'product')
      .where('user_item.user_id = :userId', { userId })
      .andWhere('user_item.status = :itemStatus', {
        itemStatus: UserProductStatus.ORDERED,
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
      .where('payment.payment_gateway = :paymentGateway', {
        paymentGateway: PAYMENT_GATEWAY.PAYPAL,
      })
      .andWhere('payment.status = :paymentStatus', {
        paymentStatus: Status.PAID,
      })
      .andWhere('user_item.status = :itemStatus', {
        itemStatus: UserProductStatus.ORDERED,
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
        itemStatus: UserProductStatus.ORDERED,
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

    const captureData = await this.paymentService.capturePayPalPayment(payment);
    this.paymentService.applyPayPalToOrder(payment, captureData);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.decreaseProductStock(payment);

      const userItemIds = payment.items.map((item) => item.user_item_id);

      await queryRunner.manager.update(
        EcommerceUserProductStatus,
        { id: In(userItemIds) },
        { status: UserProductStatus.ORDERED },
      );

      await queryRunner.manager.save(EcommercePayment, payment);

      const userId = payment.items[0]?.user_item?.user_id;
      if (userId) {
        await this.cartService.clearSelectedDeliveryOption(userId);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return payment;
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
