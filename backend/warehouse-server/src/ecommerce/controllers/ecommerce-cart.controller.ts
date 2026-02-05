import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  CartService,
  CartItemsResponse,
  CheckoutCartResponse,
} from '../services/ecommerce-cart.service';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeliveryOption } from 'src/shared/get-delivery-fee.service';
import { CheckoutDto } from '../dto/cart/checkout.dto';
import { DeliveryRatesDto } from '../dto/cart/delivery-rates.dto';

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
  async getCart(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) {
      return { items: [], final_amount: 0 };
    }
    return this.cartService.getCart(userId);
  }

  @Get('grouped-by-cargo')
  async getCartGroupedByCargo(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) {
      return {
        items: {},
        total_amount: 0,
        final_amount: 0,
        total_delivery_fee: 0,
      };
    }

    return this.cartService.getCartGroupedByCargo(userId);
  }

  @Post('add')
  async addToCart(
    @Request() req: AuthenticatedRequest,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartItemsResponse> {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Post('sync-local-storage-products-to-cart')
  async syncLocalStorageProductsToCart(
    @Request() req: AuthenticatedRequest,
    @Body() body: { products: { product_id: string; quantity: number }[] },
  ): Promise<CartItemsResponse> {
    return this.cartService.syncLocalStorageProductsToCart(
      req.user.id,
      body.products,
    );
  }

  @Post('select-delivery-option')
  async selectDeliveryOption(
    @Request() req: AuthenticatedRequest,
    @Body() body: { delivery_option: DeliveryOption },
  ): Promise<{ success: boolean }> {
    await this.cartService.setSelectedDeliveryOption(
      req.user.id,
      body.delivery_option,
    );
    return { success: true };
  }

  @Delete('items/:itemId')
  async removeFromCart(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
  ): Promise<CartItemsResponse> {
    return this.cartService.removeFromCart(req.user.id, itemId);
  }

  @Delete('items/:itemId/all')
  async removeEntireProductFromCart(
    @Request() req: AuthenticatedRequest,
    @Param('itemId') itemId: string,
  ): Promise<CartItemsResponse> {
    return this.cartService.removeEntireProductFromCart(req.user.id, itemId);
  }

  @Delete('clear')
  async clearCart(
    @Request() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    await this.cartService.clearCart(req.user.id);
    return { message: 'Cart cleared successfully' };
  }

  @Post('delivery-rates')
  async getDeliveryRates(
    @Request() req: AuthenticatedRequest,
    @Body() body: DeliveryRatesDto,
  ): Promise<DeliveryOption[]> {
    const userId = req.user?.id;
    if (!userId) {
      return [];
    }
    const { productIds } = body;
    return this.cartService.getDeliveryRates(userId, productIds);
  }

  @Post('checkout')
  async postCheckout(
    @Request() req: AuthenticatedRequest,
    @Body() body: CheckoutDto,
  ): Promise<CheckoutCartResponse> {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const { productIds } = body;

    return this.cartService.getCheckoutData(userId, productIds);
  }
}
