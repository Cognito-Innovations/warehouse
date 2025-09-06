import { PreArrivalService } from './pre-arrivals.service';
import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { CreatePreArrivalDto } from './dto/create-pre-arrival.dto';
import { PreArrivalResponseDto } from './dto/pre-arrival-response.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('pre-arrival')
export class PreArrivaController {
  constructor(private readonly preArrivalService: PreArrivalService) {}

  @Post()
  @Public()
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
