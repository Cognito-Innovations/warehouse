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
import { CartService, ComputedCart } from '../services/ecommerce-cart.service';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeliveryOption } from 'src/shared/get-delivery-fee.service';

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
    @Query('currency') currency?: string,
    @Query('countryCode') countryCode?: string,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { items: [], final_amount: 0 }; 
    }
    return this.cartService.getCart(userId, currency, countryCode);
  }

  @Post('add')
  async addToCart(
    @Request() req: AuthenticatedRequest,
    @Body() addToCartDto: AddToCartDto,
    @Query('currency') currency?: string,
    @Query('countryCode') countryCode?: string,
  ): Promise<ComputedCart> {
    return this.cartService.addToCart(
      req.user.id,
      addToCartDto,
      currency,
      countryCode,
    );
  }

  @Put('items/:itemId')
  async updateCartItem(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Query('currency') currency?: string,
    @Query('countryCode') countryCode?: string,
  ): Promise<ComputedCart> {
    return this.cartService.updateCartItem(
      req.user.id,
      itemId,
      updateCartItemDto,
      currency,
      countryCode,
    );
  }

  @Delete('items/:itemId')
  async removeFromCart(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
    @Query('currency') currency?: string,
    @Query('countryCode') countryCode?: string,
  ): Promise<ComputedCart> {
    return this.cartService.removeFromCart(
      req.user.id,
      itemId,
      currency,
      countryCode,
    );
  }

  @Delete('clear')
  async clearCart(
    @Request() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    await this.cartService.clearCart(req.user.id);
    return { message: 'Cart cleared successfully' };
  }

  @Get('delivery-rates')
  async getDeliveryRates(
    @Request() req: AuthenticatedRequest,
    @Query('countryCode') countryCode?: string,
    @Query('currencyCode') currencyCode?: string,
  ): Promise<DeliveryOption[]> {
    const userId = req.user?.id;
    if (!userId || !countryCode) {
      return [];
    }
    return this.cartService.getDeliveryRates(userId, countryCode, currencyCode);
  }
}
