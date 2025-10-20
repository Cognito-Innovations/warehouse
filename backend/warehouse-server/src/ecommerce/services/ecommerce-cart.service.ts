import { Injectable, NotFoundException } from '@nestjs/common';
import { EcommerceCart } from '../entities/ecommerce-cart.entity';
import { EcommerceCartItem } from '../entities/ecommerce-cart-item.entity';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';

import { CartStatus } from '../entities/ecommerce-cart.entity';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';

//TODO: Generated temprorarily need to look requirment and change
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(EcommerceCart)
    private readonly cartRepository: Repository<EcommerceCart>,
    @InjectRepository(EcommerceCartItem)
    private readonly cartItemRepository: Repository<EcommerceCartItem>,
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
  ) {}

  async getOrCreateCart(userId: string): Promise<EcommerceCart> {
    let cart = await this.cartRepository.findOne({
      where: { user_id: userId, status: CartStatus.ACTIVE },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user_id: userId,
        status: CartStatus.ACTIVE,
        total_amount: 0,
        discount_amount: 0,
        final_amount: 0,
      });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<EcommerceCart> {
    const { product_id, quantity } = addToCartDto;

    // Get or create cart
    const cart = await this.getOrCreateCart(userId);

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
      existingItem.total_price =
        existingItem.quantity * existingItem.unit_price;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Add new item
      const discountAmount =
        (product.price * product.discount_percentage) / 100;
      const finalPrice = product.price - discountAmount;

      const cartItem = this.cartItemRepository.create({
        cart_id: cart.id,
        product_id,
        quantity,
        unit_price: finalPrice,
        total_price: finalPrice * quantity,
        discount_amount: discountAmount * quantity,
      });

      await this.cartItemRepository.save(cartItem);
    }

    // Recalculate cart totals
    await this.recalculateCartTotals(cart.id);

    return this.getOrCreateCart(userId);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<EcommerceCart> {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    cartItem.total_price = cartItem.quantity * cartItem.unit_price;
    cartItem.discount_amount =
      (cartItem.product.price - cartItem.unit_price) * cartItem.quantity;

    await this.cartItemRepository.save(cartItem);
    await this.recalculateCartTotals(cart.id);

    return this.getOrCreateCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<EcommerceCart> {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
    await this.recalculateCartTotals(cart.id);

    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.delete({ cart_id: cart.id });
    await this.recalculateCartTotals(cart.id);
  }

  async getCart(userId: string): Promise<EcommerceCart> {
    return this.getOrCreateCart(userId);
  }

  private async recalculateCartTotals(cartId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });

    if (!cart) return;

    const items = await this.cartItemRepository.find({
      where: { cart_id: cartId },
    });

    const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);
    const discountAmount = items.reduce(
      (sum, item) => sum + item.discount_amount,
      0,
    );
    const finalAmount = totalAmount;

    cart.total_amount = totalAmount;
    cart.discount_amount = discountAmount;
    cart.final_amount = finalAmount;

    await this.cartRepository.save(cart);
  }
}
