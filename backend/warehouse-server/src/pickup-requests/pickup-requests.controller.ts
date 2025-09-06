import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PickupRequestsService } from './pickup-requests.service';
import { CreatePickupRequestDto } from './dto/create-pickup-request.dto';
import { PickupRequestResponseDto } from './dto/pickup-request-response.dto';

@Controller('pickup-requests')
@UseGuards(JwtAuthGuard)
export class PickupRequestsController {
  constructor(private readonly pickupRequestsService: PickupRequestsService) {}

  @Post()
  async create(
    @Body() createPickupRequestDto: CreatePickupRequestDto,
  ): Promise<PickupRequestResponseDto> {
    return this.pickupRequestsService.createPickupRequest(
      createPickupRequestDto,
    );
  }

  @Get()
  async findAll(): Promise<PickupRequestResponseDto[]> {
    return this.pickupRequestsService.getAllPickupRequests();
  }

  @Get(':userId')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<PickupRequestResponseDto[]> {
    return this.pickupRequestsService.getPickupRequestsByUser(userId);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string): Promise<PickupRequestResponseDto> {
    return this.pickupRequestsService.getPickupRequestById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; price?: number },
  ): Promise<PickupRequestResponseDto> {
    return this.pickupRequestsService.updateStatus(id, body.status, body.price);
  }
}
