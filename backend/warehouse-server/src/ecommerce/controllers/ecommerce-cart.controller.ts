import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from '../services/ecommerce-cart.service';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ecommerce-cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    const userId = req.user?.id;
    if (!userId) {
      return { items: [], final_amount: 0 };
    }
    return this.cartService.getCart(userId);
  }

  @Post('add')
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put('items/:itemId')
  async updateCartItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(
      req.user.id,
      itemId,
      updateCartItemDto,
    );
  }

  @Delete('items/:itemId')
  async removeFromCart(@Request() req, @Param('itemId') itemId: string) {
    return this.cartService.removeFromCart(req.user.id, itemId);
  }

  @Delete('clear')
  async clearCart(@Request() req) {
    await this.cartService.clearCart(req.user.id);
    return { message: 'Cart cleared successfully' };
  }
}
