import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  private async findActiveCart(userId: string): Promise<EcommerceCart | null> {
    return await this.cartRepository.findOne({
      where: { user_id: userId, status: CartStatus.ACTIVE },
      relations: ['items', 'items.product', 'items.product.category', 'user'],
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
  ): Promise<ComputedCart> {
    const { product_id, quantity } = addToCartDto;

    // Get or create cart
    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product is already in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id },
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
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

    return this.getCart(userId, currency);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
    currency?: string,
  ): Promise<ComputedCart> {
    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateCartItemDto.quantity;

    await this.cartItemRepository.save(cartItem);

    return this.getCart(userId, currency);
  }

  async removeFromCart(
    userId: string,
    itemId: string,
    currency?: string,
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
      return this.getCart(userId, currency);
    }

    await this.cartItemRepository.remove(cartItem);

    return this.getCart(userId, currency);
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
  ): Promise<ComputedCart & { currency?: string }> {
    let cart = await this.findActiveCart(userId);
    if (!cart) cart = await this.createCart(userId);

    const items: ComputedCartItem[] = (cart.items ?? []).map((item) => {
      const price = Number(item.product?.price ?? 0);
      const discountPerc = Number(item.product?.discount_percentage ?? 0);

      const discountPerUnit = (price * discountPerc) / 100;
      const unitPrice = price - discountPerUnit;

      return {
        ...item,
        unit_price: unitPrice,
        total_price: unitPrice * item.quantity,
        discount_amount: discountPerUnit * item.quantity,
        product: item.product ?? null,
      };
    });

    const totalAmount = items.reduce((sum, it) => sum + it.total_price, 0);
    const totalDiscount = items.reduce(
      (sum, it) => sum + it.discount_amount,
      0,
    );
    const finalAmount = totalAmount - totalDiscount;

    const computedCart: ComputedCart = {
      items,
      total_amount: totalAmount,
      discount_amount: totalDiscount,
      final_amount: finalAmount,
    };

    return this.applyCurrencyConversion(
      computedCart,
      currency ?? DEFAULT_CURRENCY.code,
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
          discount_amount: await convert(item.discount_amount),
          product,
        } as ComputedCartItem;
      }),
    );

    return {
      ...cart,
      total_amount: await convert(cart.total_amount),
      discount_amount: await convert(cart.discount_amount),
      final_amount: await convert(cart.final_amount),
      items: convertedItems,
    };
  }
}
