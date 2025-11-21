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

    let itemsToProcess = cart.items;

    if (createOrderDto.product_ids && createOrderDto.product_ids.length > 0) {
      itemsToProcess = cart.items.filter((item) => 
        createOrderDto.product_ids!.includes(item.product_id)
      );

      if (itemsToProcess.length === 0) {
        throw new BadRequestException(
          'None of the selected products exist in your active cart'
        );
      }
    }

    const user = cart.user;
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const countryName =
      createOrderDto.country_name || 'United States of America';
    const currencyResponse = await this.currencyRepository.findOne({
      where: { country: { name: countryName } },
      relations: ['country'],
    });

    if (!currencyResponse) {
      throw new BadRequestException('Currency not found for country');
    }

    const orderCurrency = currencyResponse.currency_code;

    let convertedGrossSubtotal = 0;
    let totalDiscountAmount = 0;

    for (const item of itemsToProcess) {
      const itemPriceBase = Number(item.unit_price);
      const itemQuantity = Number(item.quantity);

      const convertedUnitPrice =
        await this.userPreferenceService.getConvertedPriceByCountry(
          countryName,
          itemPriceBase,
        );

      const lineTotal = convertedUnitPrice * itemQuantity;
      const itemDiscountPercent = Number(item.discount_percentage) || 0;
      const lineDiscount = lineTotal * (itemDiscountPercent / 100);

      convertedGrossSubtotal += lineTotal;
      totalDiscountAmount += lineDiscount;
    };

    const convertedProductSubtotal =
      convertedGrossSubtotal - totalDiscountAmount;

    if (isNaN(convertedProductSubtotal))
      throw new BadRequestException('Invalid cart amount');

    const isIndia = countryName === 'India';
    const threshold = isIndia ? 299 : 20;
    const deliveryFeeBase = isIndia ? 3 : 5;
    const serviceChargeBase = 1;

    const deliveryFee =
      convertedProductSubtotal >= threshold ? 0 : deliveryFeeBase;

    const taxAmount = convertedProductSubtotal * 0.02;
    const serviceCharge = serviceChargeBase;

    const finalTotal =
      convertedProductSubtotal + deliveryFee + taxAmount + serviceCharge;

    const roundedTotal = Number(finalTotal.toFixed(2));
    const roundedSubtotal = Number(convertedProductSubtotal.toFixed(2));
    const roundedShipping = Number(deliveryFee.toFixed(2));
    const roundedTax = Number(taxAmount.toFixed(2));

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = this.orderRepository.create({
      order_number: orderNumber,
      user_id: userId,
      status: OrderStatus.PENDING,
      payment_status: PaymentStatus.PENDING,
      subtotal: roundedSubtotal, 
      discount_percentage: cart.discount_percentage,
      shipping_amount: roundedShipping,
      tax_amount: roundedTax,
      total_amount: roundedTotal,
      shipping_address: createOrderDto.shipping_address,
      billing_address: createOrderDto.billing_address,
      notes: createOrderDto.notes,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items from cart items
    const orderItems = itemsToProcess.map((cartItem) =>
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
    } catch (cashfreeErr: any) {
      // Rollback on Cashfree failure
      await this.orderRepository.delete(savedOrder.id);

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
        return_url: `${process.env.FRONTEND_URL}/ecommerce/checkout/success?orderNumber=${orderNumber}`
        // return_url: `${process.env.FRONTEND_URL}/order`,
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

    const productIds = order.items.map((item) => item.product_id);
    const cart = await this.cartRepository.findOne({
      where: { 
        user_id: order.user.id, 
        status: CartStatus.ACTIVE,
      },
      relations: ['items'],
    });

    if (cart && cart.items.length > 0) {
      const itemsToRemove = cart.items.filter((item) => 
        productIds.includes(item.product_id)
      );

      if (itemsToRemove.length > 0) {
        await this.cartItemRepository.delete(itemsToRemove.map((i) => i.id));

        const updatedCart = await this.cartRepository.findOne({
          where: { id: cart.id },
          relations: ['items'],
        });

        if (updatedCart && updatedCart.items.length === 0) {
          updatedCart.status = CartStatus.CHECKED_OUT;
          await this.cartRepository.save(updatedCart);
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
