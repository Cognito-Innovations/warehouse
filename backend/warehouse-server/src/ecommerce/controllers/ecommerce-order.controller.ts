import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from '../services/ecommerce-order.service';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { OrderStatus, PaymentStatus } from '../entities/ecommerce-order.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('ecommerce-orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(req.user.id, createOrderDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.orderService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }

  @Get('order-number/:orderNumber')
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.orderService.findByOrderNumber(orderNumber);
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }

  @Put(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('paymentStatus') paymentStatus: PaymentStatus,
  ) {
    return this.orderService.updatePaymentStatus(id, paymentStatus);
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
