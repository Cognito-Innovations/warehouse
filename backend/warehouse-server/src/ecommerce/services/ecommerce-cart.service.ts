import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceCart } from '../entities/ecommerce-cart.entity';
import { EcommerceCartItem } from '../entities/ecommerce-cart-item.entity';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';

import { CartStatus } from '../entities/ecommerce-cart.entity';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';

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
      relations: ['items', 'items.product', 'user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          suite_no: true,
        }
      }
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
    country?: string,
  ): Promise<any> {
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

    return this.getCart(userId, country);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
    country?: string,
  ): Promise<any> {
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

    return this.getCart(userId, country);
  }

  async removeFromCart(
    userId: string,
    itemId: string,
    country?: string,
  ): Promise<any> {
    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    // If item doesn't exist, it might have been already deleted (idempotent operation)
    if (!cartItem) {
      return this.getCart(userId, country);
    }

    await this.cartItemRepository.remove(cartItem);

    return this.getCart(userId, country);
  }

  async clearCart(userId: string): Promise<void> {
    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }
    await this.cartItemRepository.delete({ cart_id: cart.id });
  }

  async getCart(userId: string, country?: string): Promise<any> {
    let cart = await this.findActiveCart(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    // Compute prices dynamically
    const computedItems = (cart.items || []).map((item) => {
      const price = Number(item.product?.price || 0);
      const discPerc = Number(item.product?.discount_percentage || 0);
      const discountAmountPerUnit = (price * discPerc) / 100;
      const unitPrice = price - discountAmountPerUnit;
      const totalPrice = unitPrice * item.quantity;
      const discountAmount = discountAmountPerUnit * item.quantity;

      return {
        ...item,
        unit_price: unitPrice,
        total_price: totalPrice,
        discount_percentage: discountAmount,
        product: item.product,
      };
    });

    const totalAmount = computedItems.reduce(
      (sum, item) => sum + item.total_price,
      0
    );
    const totalDiscount = computedItems.reduce(
      (sum, item) => sum + item.discount_percentage,
      0
    );
    const finalAmount = totalAmount - totalDiscount;

    const cartWithComputedTotals = {
      ...cart,
      items: computedItems,
      total_amount: totalAmount,
      discount_percentage: totalDiscount,
      final_amount: finalAmount,
    };

    const selectedCountry = country || 'United States of America';
    return this.applyCurrencyConversion(
      cartWithComputedTotals,
      selectedCountry
    );
  }

  private async applyCurrencyConversion(
    cart: any,
    country: string,
  ): Promise<any> {
    if (!cart) return cart;

    const convert = (price: number | string) => 
      this.userPreferencesService.getFormattedConvertedPriceByCountry(
        country,
        Number(price),
      );

    const convertedItems = await Promise.all(
      (cart.items || []).map(async (item: any) => {
        const convertedProduct = item.product
          ? {
              ...item.product,
              price: await convert(item.product.price),
            }
          : null;

        return {
          ...item,
          unit_price: await convert(item.unit_price),
          total_price: await convert(item.total_price),
          discount_percentage: await convert(item.discount_percentage),
          product: convertedProduct,
        };
      }),
    );

    return {
      ...cart,
      total_amount: await convert(cart.total_amount),
      discount_percentage: await convert(cart.discount_percentage),
      final_amount: await convert(cart.final_amount),
      items: convertedItems, 
    };
  }
}
