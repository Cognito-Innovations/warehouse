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
        discount_percentage: 0,
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

    const price = parseFloat(product.price.toString());
    const discPerc = parseFloat(product.discount_percentage.toString());
    const discountAmountPerUnit = (price * discPerc) / 100;
    const unitPrice = price - discountAmountPerUnit;

    // Check if product is already in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id },
    });

    if (existingItem) {
      // Update quantity
      const currentDiscount =
        parseFloat(existingItem.discount_percentage.toString()) || 0;
      existingItem.quantity += quantity;
      existingItem.unit_price = unitPrice;
      existingItem.total_price = existingItem.quantity * unitPrice;
      existingItem.discount_percentage =
        currentDiscount+ (discountAmountPerUnit * quantity);
      await this.cartItemRepository.save(existingItem);
    } else {
      // Add new item
      const totalPrice = unitPrice * quantity;
      const totalDiscount = discountAmountPerUnit * quantity;

      const cartItem = this.cartItemRepository.create({
        cart_id: cart.id,
        product_id,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        discount_percentage: totalDiscount,
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
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const newQuantity = updateCartItemDto.quantity;
    const price = parseFloat(cartItem.product.price.toString());
    const discPerc = parseFloat(
      cartItem.product.discount_percentage.toString()
    );
    const discountAmountPerUnit = (price * discPerc) / 100;
    const unitPrice = price - discountAmountPerUnit;

    cartItem.quantity = newQuantity;
    cartItem.unit_price = unitPrice;
    cartItem.total_price = newQuantity * unitPrice;
    cartItem.discount_percentage = discountAmountPerUnit * newQuantity;

    await this.cartItemRepository.save(cartItem);
    await this.recalculateCartTotals(cart.id);

    return this.getOrCreateCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<EcommerceCart> {
    const cart = await this.getOrCreateCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    // If item doesn't exist, it might have been already deleted (idempotent operation)
    // Just recalculate totals and return cart to ensure consistency
    if (!cartItem) {
      await this.recalculateCartTotals(cart.id);
      return this.getOrCreateCart(userId);
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
    });

    if (!cart) return;

    const items = await this.cartItemRepository.find({
      where: { cart_id: cartId },
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + parseFloat(item.total_price.toString()),
      0);
    const totalDiscount = items.reduce(
      (sum, item) => sum + parseFloat(item.discount_percentage.toString()),
      0,
    );
    const finalAmount = totalAmount - totalDiscount;

    // Use update instead of save to avoid cascading issues with relations
    await this.cartRepository.update(cartId, {
      total_amount: totalAmount,
      discount_percentage: totalDiscount,
      final_amount: finalAmount,
    });
  }
}
