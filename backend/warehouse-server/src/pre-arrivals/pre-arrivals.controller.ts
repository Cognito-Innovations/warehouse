import { PreArrivalService } from './pre-arrivals.service';
import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';

@Controller('pre-arrival')
export class PreArrivaController {
  constructor(private readonly preArrivalService: PreArrivalService) {}

  @Post()
  async create(@Body() body: any) {
    return this.preArrivalService.createPrearrival(body);
  }

  @Get()
  async findAll() {
    return this.preArrivalService.getAllPrearrival();
  }

  @Get(':id')
  async getOtpById(@Param('id') id: string) {
    return this.preArrivalService.getOTPById(id);
  }

  @Patch(':id')
  async markStatusReceived(@Param('id') id: string) {
    return this.preArrivalService.updateStatusToReceived(id);
  }
}