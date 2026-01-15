import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ComputedCart, EcommerceCart } from '../entities/ecommerce-cart.entity';
import {
  ComputedCartItem,
  EcommerceCartItem,
} from '../entities/ecommerce-cart-item.entity';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';

import { CartStatus } from '../entities/ecommerce-cart.entity';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { DEFAULT_CURRENCY } from '../../shared/constants.js';
import { DeliveryFeeService, DeliveryOption } from 'src/shared/get-delivery-fee.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(EcommerceCart)
    private readonly cartRepository: Repository<EcommerceCart>,
    @InjectRepository(EcommerceCartItem)
    private readonly cartItemRepository: Repository<EcommerceCartItem>,
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly deliveryFeeService: DeliveryFeeService,
  ) {}

  private async findActiveCart(userId: string): Promise<EcommerceCart | null> {
    return await this.cartRepository.findOne({
      where: { user_id: userId, status: CartStatus.ACTIVE },
      relations: [
        'items',
        'items.product',
        'items.product.category',
        'items.product.measurement',
        'user',
      ],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          suite_no: true,
        },
      },
    });
  }

  private validateProductAndStock(
    product: EcommerceProduct | null,
    requestedQuantity: number,
    existingQuantity = 0,
  ) {
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.is_active) {
      throw new BadRequestException('This product is currently unavailable');
    }

    const totalRequested = existingQuantity + requestedQuantity;

    if (totalRequested > product.stock_quantity) {
      if (existingQuantity > 0) {
        throw new BadRequestException(
          `Only ${product.stock_quantity} item(s) available in stock. You already have ${existingQuantity} in your cart.`,
        );
      }

      throw new BadRequestException(
        `Only ${product.stock_quantity} item(s) available in stock.`,
      );
    }
  }

  async createCart(userId: string): Promise<EcommerceCart> {
    const cart = this.cartRepository.create({
      user_id: userId,
      status: CartStatus.ACTIVE,
    });

    return await this.cartRepository.save(cart);
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    const { product_id, quantity } = addToCartDto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    // Get or create cart
    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: product_id },
      select: ['id', 'price', 'stock_quantity', 'is_active'],
    });

    // Check if product is already in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id },
    });

    const existingQuantity = existingItem?.quantity ?? 0;
    this.validateProductAndStock(product, quantity, existingQuantity);

    if (existingItem) {
      // Update quantity
      existingItem.quantity = existingQuantity + quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Add new item
      const cartItem = this.cartItemRepository.create({
        cart_id: cart.id,
        product_id,
        quantity,
      });

      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(userId, currency, countryCode);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    const { quantity } = updateCartItemDto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart_id: cart.id },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const product = cartItem.product;

    this.validateProductAndStock(product, quantity);

    cartItem.quantity = quantity;

    await this.cartItemRepository.save(cartItem);

    return this.getCart(userId, currency, countryCode);
  }

  async removeFromCart(
    userId: string,
    itemId: string,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    // If item doesn't exist, it might have been already deleted (idempotent operation)
    if (!cartItem) {
      return this.getCart(userId, currency, countryCode);
    }

    await this.cartItemRepository.remove(cartItem);

    return this.getCart(userId, currency, countryCode);
  }

  async clearCart(userId: string): Promise<void> {
    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }
    await this.cartItemRepository.delete({ cart_id: cart.id });
  }

  async getCart(
    userId: string,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart & { currency?: string }> {
    let cart = await this.findActiveCart(userId);
    if (!cart) cart = await this.createCart(userId);

    const items: ComputedCartItem[] = await Promise.all(
      (cart.items ?? []).map(async (item) => {
        const price = Number(item.product?.price ?? 0);
        const weightPerUnit = this.deliveryFeeService.getWeightInKg(
          Number(item.product?.unit_value ?? 0),
          item.product?.measurement?.label ?? 'kg',
        );
        const totalWeight = weightPerUnit * item.quantity;
        const delivery_fee = await this.deliveryFeeService.getDeliveryFee(
          totalWeight,
          countryCode!,
        );

        return {
          ...item,
          unit_price: price,
          total_price: price * item.quantity,
          delivery_fee,
          product: item.product ?? null,
        };
      }),
    );

    const totalAmount = items.reduce((sum, it) => sum + it.total_price, 0);
    const totalDeliveryFee = items.reduce(
      (sum, it) => sum + it.delivery_fee,
      0,
    );
    const finalAmount = totalAmount + totalDeliveryFee;

    const computedCart: ComputedCart = {
      items,
      total_amount: totalAmount,
      final_amount: finalAmount,
      total_delivery_fee: totalDeliveryFee,
    };

    return this.applyCurrencyConversion(
      computedCart,
      currency ?? DEFAULT_CURRENCY.code,
    );
  }

  async getDeliveryRates(
    userId: string,
    countryCode?: string,
  ): Promise<DeliveryOption[]> {
    const cart = await this.findActiveCart(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      return [];
    }

    // Calculate total weight from all cart items
    let totalWeight = 0;
    for (const item of cart.items) {
      const weightPerUnit = this.deliveryFeeService.getWeightInKg(
        Number(item.product?.unit_value ?? 0),
        item.product?.measurement?.label ?? 'kg',
      );
      totalWeight += weightPerUnit * item.quantity;
    }

    if (totalWeight <= 0 || !countryCode) {
      return [];
    }

    return await this.deliveryFeeService.getDeliveryOptions(
      totalWeight,
      countryCode,
    );
  }

  private async applyCurrencyConversion(
    cart: ComputedCart,
    currency: string,
  ): Promise<ComputedCart> {
    const convert = async (price: number): Promise<number> => {
      const result =
        await this.userPreferencesService.getFormattedConvertedPriceByCurrency(
          currency,
          price,
        );
      return typeof result === 'number' ? result : Number(result.price);
    };

    const convertedItems = await Promise.all(
      cart.items.map(async (item) => {
        let product = item.product;
        if (product) {
          product = Object.assign(product, {
            price: await convert(Number(product.price)),
          });
        }

        return {
          ...item,
          unit_price: await convert(item.unit_price),
          total_price: await convert(item.total_price),
          delivery_fee: await convert(item.delivery_fee ?? 0),
          product,
        } as ComputedCartItem;
      }),
    );

    return {
      ...cart,
      total_amount: await convert(cart.total_amount),
      final_amount: await convert(cart.final_amount),
      total_delivery_fee: await convert(cart.total_delivery_fee ?? 0),
      items: convertedItems,
    };
  }
}
