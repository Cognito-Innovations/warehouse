import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EcommerceOrder } from '../entities/ecommerce-order.entity';
import { EcommerceOrderItem } from '../entities/ecommerce-order-item.entity';
import { EcommerceCart } from '../entities/ecommerce-cart.entity';
import { EcommerceCartItem } from '../entities/ecommerce-cart-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { OrderStatus, PaymentStatus } from '../entities/ecommerce-order.entity';
import { CartStatus } from '../entities/ecommerce-cart.entity';

//TODO: Generated temprorarily need to look requirment and change
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(EcommerceOrder)
    private readonly orderRepository: Repository<EcommerceOrder>,
    @InjectRepository(EcommerceOrderItem)
    private readonly orderItemRepository: Repository<EcommerceOrderItem>,
    @InjectRepository(EcommerceCart)
    private readonly cartRepository: Repository<EcommerceCart>,
    @InjectRepository(EcommerceCartItem)
    private readonly cartItemRepository: Repository<EcommerceCartItem>,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<EcommerceOrder> {
    // Get user's active cart
    const cart = await this.cartRepository.findOne({
      where: { user_id: userId, status: CartStatus.ACTIVE },
      relations: ['items', 'items.product'],
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = this.orderRepository.create({
      order_number: orderNumber,
      user_id: userId,
      status: createOrderDto.status || OrderStatus.PENDING,
      payment_status: createOrderDto.payment_status || PaymentStatus.PENDING,
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
    cart.status = CartStatus.CHECKED_OUT;
    await this.cartRepository.save(cart);

    return this.findOne(savedOrder.id);
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
    id: string,
    paymentStatus: PaymentStatus,
  ): Promise<EcommerceOrder> {
    const order = await this.findOne(id);
    order.payment_status = paymentStatus;
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
