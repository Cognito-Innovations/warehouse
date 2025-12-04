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
  Query,
} from '@nestjs/common';
import { CartService } from '../services/ecommerce-cart.service';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('ecommerce-cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(
    @Request() req: AuthenticatedRequest,
    @Query('country') country?: string,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { items: [], final_amount: 0 };
    }
    return this.cartService.getCart(userId, country);
  }

  @Post('add')
  async addToCart(
    @Request() req: AuthenticatedRequest,
    @Body() addToCartDto: AddToCartDto,
    @Query('country') country?: string,
  ) {
    return this.cartService.addToCart(req.user.id, addToCartDto, country);
  }

  @Put('items/:itemId')
  async updateCartItem(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Query('country') country?: string,
  ) {
    return this.cartService.updateCartItem(
      req.user.id,
      itemId,
      updateCartItemDto,
      country,
    );
  }

  @Delete('items/:itemId')
  async removeFromCart(
    @Request() req,
    @Param('itemId') itemId: string,
    @Query('country') country?: string,
  ) {
    return this.cartService.removeFromCart(req.user.id, itemId, country);
  }

  @Delete('clear')
  async clearCart(@Request() req: AuthenticatedRequest) {
    await this.cartService.clearCart(req.user.id);
    return { message: 'Cart cleared successfully' };
  }
}
