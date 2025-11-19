import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { EcommerceOrder } from '../entities/ecommerce-order.entity';
import { EcommerceOrderItem } from '../entities/ecommerce-order-item.entity';
import { EcommerceCart } from '../entities/ecommerce-cart.entity';
import { EcommerceCartItem } from '../entities/ecommerce-cart-item.entity';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { OrderStatus, PaymentStatus } from '../entities/ecommerce-order.entity';
import { CartStatus } from '../entities/ecommerce-cart.entity';
import { User } from 'src/users/user.entity';
import { Currency } from 'src/currencies/currency.entity';
import { CountryCode } from 'src/Countries/country.entity';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';

//TODO: Generated temprorarily need to look requirment and change
@Injectable()
export class OrderService {
  private cashfree: Cashfree;

  constructor(
    @InjectRepository(EcommerceOrder)
    private readonly orderRepository: Repository<EcommerceOrder>,
    @InjectRepository(EcommerceOrderItem)
    private readonly orderItemRepository: Repository<EcommerceOrderItem>,
    @InjectRepository(EcommerceCart)
    private readonly cartRepository: Repository<EcommerceCart>,
    @InjectRepository(EcommerceCartItem)
    private readonly cartItemRepository: Repository<EcommerceCartItem>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    private readonly userPreferenceService: UserPreferencesService
  ) {
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const mode = process.env.CASHFREE_MODE;

    if (!appId || !secretKey) {
      throw new BadRequestException('Cashfree credentials not configured');
    }

    this.cashfree = new Cashfree(
      mode === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
      appId,
      secretKey,
    )
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

    const user = cart.user;
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const countryCode = createOrderDto.country_code || 'USA';
    const currencyResponse = await this.currencyRepository.findOne({
      where: { country: { code: countryCode as CountryCode } },
      relations: ['country'],
    });

    if (!currencyResponse) {
      throw new BadRequestException('Currency not found for country');
    }

    const orderCurrency = currencyResponse.currency_code;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = this.orderRepository.create({
      order_number: orderNumber,
      user_id: userId,
      status: OrderStatus.PENDING,
      payment_status: PaymentStatus.PENDING,
      subtotal: cart.total_amount,
      discount_percentage: cart.discount_percentage,
      shipping_amount: 0, // Can be calculated based on shipping rules
      tax_amount: 0, // Can be calculated based on tax rules
      total_amount: cart.final_amount,
      shipping_address: createOrderDto.shipping_address,
      billing_address: createOrderDto.billing_address,
      notes: createOrderDto.notes,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items from cart items
    const orderItems = cart.items.map((cartItem) =>
      this.orderItemRepository.create({
        order_id: savedOrder.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        unit_price: cartItem.unit_price,
        total_price: cartItem.total_price,
        discount_percentage: cartItem.discount_percentage,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    // Mark cart as checked out
    const originalCartStatus = cart.status;
    cart.status = CartStatus.CHECKED_OUT;
    await this.cartRepository.save(cart);

    try {
      let amountNum = Number(savedOrder.total_amount);
      if(isNaN(amountNum)) throw new BadRequestException('Invalid order amount')

      const converted = await this.userPreferenceService.getConvertedPrice(
        userId,
        amountNum,
      )

      const finalAmount = Number(converted.toFixed(2));

      await this.createCashfreePaymentSession(
        savedOrder,
        user,
        orderNumber,
        createOrderDto,
        orderCurrency,
        finalAmount,
      );

      return await this.findOne(savedOrder.id);
    } catch (cashfreeErr: any) {
      // Rollback on Cashfree failure
      await this.orderRepository.delete(savedOrder.id);
      cart.status = originalCartStatus;
      await this.cartRepository.save(cart);

      console.error(
        'Cashfree error:',
        cashfreeErr.response?.data || cashfreeErr.message
      );

      throw new BadRequestException(
        'Failed to initialize payment session: ' +
          (cashfreeErr.response?.data?.message ||
            cashfreeErr.message ||
            'Unknown error')
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

    savedOrder.cashfree_session_id = cashfreeResponse.data.payment_session_id!;
    await this.orderRepository.save(savedOrder);
  }

  async findAll(userId?: string): Promise<EcommerceOrder[]> {
    const whereCondition = userId ? { user_id: userId } : {};

    return this.orderRepository.find({
      where: whereCondition,
      relations: ['items', 'items.product', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EcommerceOrder> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrdersByUser(userId?: string): Promise<EcommerceOrder[]> {
    const whereCondition = userId ? { user_id: userId } : {};

    return this.orderRepository.find({
      where: whereCondition,
      relations: ['items', 'items.product', 'user'],
      order: { created_at: 'DESC' },
    });
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
  ): Promise<EcommerceOrder> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async updatePaymentStatus(
    orderId: string,
    cashfreeData: any,
  ): Promise<EcommerceOrder> {
    const order = await this.findOne(orderId);
    if (order.payment_status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment already processed');
    }

    order.payment_status = PaymentStatus.PAID;
    order.cashfree_payment_id = cashfreeData.cf_payment_id;
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
