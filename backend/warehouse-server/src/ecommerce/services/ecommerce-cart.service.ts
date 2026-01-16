import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { DEFAULT_CURRENCY } from '../../shared/constants.js';
import {
  DeliveryFeeService,
  DeliveryOption,
} from 'src/shared/get-delivery-fee.service';
import {
  EcommerceUserItem,
  UserItemStatus,
} from '../entities/ecommerce-user-items.entity';

export interface ComputedCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product: EcommerceProduct | null;
  unit_price: number;
  total_price: number;
  delivery_fee: number;
  created_at: number;
  updated_at: number;
}

export interface ComputedCart {
  items: ComputedCartItem[];
  total_amount: number;
  final_amount: number;
  total_delivery_fee?: number;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(EcommerceUserItem)
    private readonly userItemRepository: Repository<EcommerceUserItem>,
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly deliveryFeeService: DeliveryFeeService,
  ) {}

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

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: product_id },
      select: ['id', 'price', 'stock_quantity', 'is_active'],
    });

    // Check if product is already in cart
    const existingItem = await this.userItemRepository.findOne({
      where: { user_id: userId, product_id, status: UserItemStatus.CART },
    });

    const existingQuantity = existingItem?.quantity ?? 0;
    this.validateProductAndStock(product, quantity, existingQuantity);

    if (existingItem) {
      // Update quantity
      existingItem.quantity = existingQuantity + quantity;
      await this.userItemRepository.save(existingItem);
    } else {
      // Add new item
      const cartItem = this.userItemRepository.create({
        user_id: userId,
        product_id,
        quantity,
        status: UserItemStatus.CART,
      });

      await this.userItemRepository.save(cartItem);
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

    const cartItem = await this.userItemRepository.findOne({
      where: { id: itemId, user_id: userId, status: UserItemStatus.CART },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found or cannot be updated');
    }

    const product = await this.productRepository.findOne({
      where: { id: cartItem.product_id },
    });

    this.validateProductAndStock(product, quantity);

    cartItem.quantity = quantity;

    await this.userItemRepository.save(cartItem);

    return this.getCart(userId, currency, countryCode);
  }

  async removeFromCart(
    userId: string,
    itemId: string,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    const cartItem = await this.userItemRepository.findOne({
      where: { id: itemId, user_id: userId, status: UserItemStatus.CART },
    });

    // If item doesn't exist, it might have been already deleted (idempotent operation)
    if (cartItem) {
      await this.userItemRepository.remove(cartItem);
    }

    return this.getCart(userId, currency, countryCode);
  }

  async clearCart(userId: string): Promise<void> {
    await this.userItemRepository.delete({
      user_id: userId,
      status: UserItemStatus.CART,
    });
  }

  async getCart(
    userId: string,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart & { currency?: string }> {
    const itemsFromDb = await this.userItemRepository.find({
      where: { user_id: userId, status: UserItemStatus.CART },
    });

    const items: ComputedCartItem[] = await Promise.all(
      (itemsFromDb ?? []).map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id },
          relations: ['category', 'measurement'],
        });
        const price = Number(product?.price ?? 0);
        const weightPerUnit = this.deliveryFeeService.getWeightInKg(
          Number(product?.unit_value ?? 0),
          product?.measurement?.label ?? 'kg',
        );
        const totalWeight = weightPerUnit * item.quantity;
        const delivery_fee = await this.deliveryFeeService.getDeliveryFee(
          totalWeight,
          countryCode!,
        );

        return {
          id: item.id,
          cart_id: userId,
          product_id: item.product_id,
          quantity: item.quantity,
          product: product ?? null,
          unit_price: price,
          total_price: price * item.quantity,
          delivery_fee,
          created_at: item.created_at,
          updated_at: item.updated_at,
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
    const items = await this.userItemRepository.find({
      where: { user_id: userId, status: UserItemStatus.CART },
    });
    if (!items || items.length === 0) {
      return [];
    }

    // Calculate total weight from all cart items
    let totalWeight = 0;
    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product_id },
        relations: ['measurement'],
      });
      const weightPerUnit = this.deliveryFeeService.getWeightInKg(
        Number(product?.unit_value ?? 0),
        product?.measurement?.label ?? 'kg',
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
