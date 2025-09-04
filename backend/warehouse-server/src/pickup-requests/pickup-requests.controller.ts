import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PickupRequestsService } from './pickup-requests.service';

@Controller('pickup-requests')
export class PickupRequestsController {
  constructor(private readonly pickupRequestsService: PickupRequestsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.pickupRequestsService.createPickupRequest(body);
  }

  @Get()
  async findAll() {
    return this.pickupRequestsService.getAllPickupRequests();
  }

  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    return this.pickupRequestsService.getPickupRequestsByUser(userId);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.pickupRequestsService.getPickupRequestById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; price?: number }
  ) {
    return this.pickupRequestsService.updateStatus(id, body.status, body.price);
  }
}