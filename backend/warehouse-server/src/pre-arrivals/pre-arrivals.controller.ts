import { PreArrivalService } from './pre-arrivals.service';
import { Body, Controller, Get, Post, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePreArrivalDto } from './dto/create-pre-arrival.dto';
import { PreArrivalResponseDto } from './dto/pre-arrival-response.dto';

@Controller('pre-arrival')
@UseGuards(JwtAuthGuard)
export class PreArrivaController {
  constructor(private readonly preArrivalService: PreArrivalService) {}

  @Post()
  async create(
    @Body() createPreArrivalDto: CreatePreArrivalDto,
  ): Promise<PreArrivalResponseDto> {
    return this.preArrivalService.createPrearrival(createPreArrivalDto);
  }

  @Get()
  async findAll(): Promise<PreArrivalResponseDto[]> {
    return this.preArrivalService.getAllPrearrival();
  }

  @Get(':id')
  async getOtpById(@Param('id') id: string): Promise<PreArrivalResponseDto> {
    return this.preArrivalService.getOTPById(id);
  }

  @Patch(':id')
  async markStatusReceived(
    @Param('id') id: string,
  ): Promise<PreArrivalResponseDto> {
    return this.preArrivalService.updateStatusToReceived(id);
  }
}
