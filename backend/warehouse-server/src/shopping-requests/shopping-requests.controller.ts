import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { ShoppingRequestsService } from './shopping-requests.service';

@Controller('shopping-requests')
export class ShoppingRequestsController {
  constructor(private readonly shoppingRequestsService: ShoppingRequestsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.shoppingRequestsService.createShoppingRequest(body);
  }

  @Get()
  async findAll() {
    return this.shoppingRequestsService.getAllShoppingRequests();
  }

  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    return this.shoppingRequestsService.getShoppingRequestsByUser(userId);
  }

  @Get('detail/by-code/:requestCode')
  async findOneByCode(@Param('requestCode') requestCode: string) {
    return this.shoppingRequestsService.getShoppingRequestByCode(requestCode);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string}
  ) {
    return this.shoppingRequestsService.updateStatus(id, body.status);
  }

  @Patch(':id/slips')
  async addPaymentSlip(
    @Param('id') id: string,
    @Body() body: { url: string }
  ) {
    return this.shoppingRequestsService.addPaymentSlip(id, body.url);
  }

}