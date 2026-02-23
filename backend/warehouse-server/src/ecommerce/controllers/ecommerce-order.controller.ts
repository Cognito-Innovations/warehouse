import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { OrderService } from '../services/ecommerce-order.service';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Status } from '../entities/ecommerce-payments.entity';

interface AuthenticatedRequest {
  user: {
    id: string;
  };
}

@Controller('ecommerce-orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('initiate')
  async initiateOrder(
    @Request() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.orderService.createOrder(
      req.user.id,
      createOrderDto,
    );
    return {
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      paymentSessionId: order.gateway_order_id,
      totalAmount: order.total_amount,
    };
  }

  @Post()
  async createOrder(
    @Request() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(req.user.id, createOrderDto);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.orderService.findAll(req.user.id);
  }

  @Get('all')
  async getAllOrders() {
    return this.orderService.getAllOrders();
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

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
    @Body('comment') comment?: string,
  ) {
    return this.orderService.updateOrderStatus(id, status, comment);
  }

  @Put(':id/payment-status')
  async updatePaymentStatus(@Param('id') id: string) {
    return this.orderService.processOrderPayment(id);
  }

  @Post(':id/capture')
  async captureOrder(@Param('id') id: string) {
    return this.orderService.processOrderPayment(id);
  }
}
