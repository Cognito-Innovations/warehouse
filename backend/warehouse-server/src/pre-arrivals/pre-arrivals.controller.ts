import { PreArrivalService } from './pre-arrivals.service';
import { Body, Controller, Get, Post, Param, Patch, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreatePreArrivalDto } from './dto/create-pre-arrival.dto';
import { PreArrivalResponseDto } from './dto/pre-arrival-response.dto';

@ApiTags('Pre-Arrivals')
@Controller('pre-arrival')
export class PreArrivaController {
  constructor(private readonly preArrivalService: PreArrivalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pre-arrival entry' })
  @ApiCreatedResponse({
    description: 'Pre-arrival created successfully',
    type: PreArrivalResponseDto,
  })
  @ApiBody({
    type: CreatePreArrivalDto,
    examples: {
      Example1: {
        summary: 'Pending Pre-Arrival',
        value: {
          customer: 'John Doe',
          suite: 'A101',
          otp: 123456,
          tracking_no: 'TRACK12345',
          estimate_arrival_time: '2025-09-08T12:00:00Z',
          details: 'Electronics shipment',
          status: 'pending',
        },
      },
    },
  })
  async create(
    @Body() createPreArrivalDto: CreatePreArrivalDto,
  ): Promise<PreArrivalResponseDto> {
    return this.preArrivalService.createPrearrival(createPreArrivalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pre-arrival entries' })
  @ApiOkResponse({
    description: 'List of all pre-arrival records',
    type: [PreArrivalResponseDto],
  })
  async findAll(): Promise<PreArrivalResponseDto[]> {
    return this.preArrivalService.getAllPrearrival();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pre-arrival entry by ID' })
  @ApiOkResponse({
    description: 'Details of a pre-arrival entry',
    type: PreArrivalResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pre-arrival not found' })
  async getOtpById(@Param('id') id: string): Promise<PreArrivalResponseDto> {
    return this.preArrivalService.getOTPById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pre-arrival status to "received"' })
  @ApiOkResponse({
    description: 'Pre-arrival status updated successfully',
    type: PreArrivalResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Status must be "pending" to mark as received',
  })
  @ApiResponse({ status: 404, description: 'Pre-arrival not found' })
  async markStatusReceived(
    @Param('id') id: string,
  ): Promise<PreArrivalResponseDto> {
    return this.preArrivalService.updateStatusToReceived(id);
  }

  @Get('user/:customer')
  @ApiOperation({ summary: 'Get all pre-arrival OTPs by customer name' })
  @ApiOkResponse({
    description: 'List of OTPs for the customer',
    type: [PreArrivalResponseDto],
  })
  async getOTPsByUser(
    @Param('customer') customer: string
  ): Promise<PreArrivalResponseDto[]> {
    return this.preArrivalService.getOTPsByUser(customer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pre-arrival by ID' })
  @ApiOkResponse({ description: 'Pre-arrival deleted successfully' })
  @ApiResponse({ status: 404, description: 'Pre-arrival not found' })
  async deletePreArrival(
    @Param('id') id: string
  ): Promise<{ message: string }> {
    await this.preArrivalService.deletePreArrival(id);
    return { message: 'Pre-arrival deleted successfully' };
  }
}
