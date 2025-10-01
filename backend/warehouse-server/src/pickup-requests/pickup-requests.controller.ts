import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PickupRequestsService } from './pickup-requests.service';
import { CreatePickupRequestDto } from './dto/create-pickup-request.dto';
import { PickupRequestResponseDto } from './dto/pickup-request-response.dto';

@ApiTags('Pickup Requests')
@Controller('pickup-requests')
@UseGuards(JwtAuthGuard)
export class PickupRequestsController {
  constructor(private readonly pickupRequestsService: PickupRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pickup request' })
  @ApiResponse({
    status: 201,
    description: 'Pickup request created successfully',
    type: PickupRequestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiBody({
    type: CreatePickupRequestDto,
    examples: {
      Amazon: {
        summary: 'Amazon supplier request',
        value: {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          country_id: '123e4567-e89b-12d3-a456-426614174001',
          pickup_address: '123 Main Street, New York, NY 10001',
          supplier_name: 'Amazon',
          supplier_phone_number: '+1-555-123-4567',
          alt_supplier_phone_number: '+1-555-987-6543',
          pcs_box: '2',
          est_weight: '5.5',
          pkg_details: 'Electronics - Laptop and accessories',
          remarks: 'Please call before pickup',
          status: 'REQUESTED',
        },
      },
    },
  })
  async create(
    @Body() createPickupRequestDto: CreatePickupRequestDto,
  ): Promise<PickupRequestResponseDto> {
    return this.pickupRequestsService.createPickupRequest(
      createPickupRequestDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all pickup requests' })
  @ApiResponse({
    status: 200,
    description: 'List of all pickup requests',
    type: [PickupRequestResponseDto],
  })
  async findAll(): Promise<PickupRequestResponseDto[]> {
    return this.pickupRequestsService.getAllPickupRequests();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get pickup requests by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'User ID to filter pickup requests',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'List of pickup requests for the specified user',
    type: [PickupRequestResponseDto],
  })
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<PickupRequestResponseDto[]> {
    return this.pickupRequestsService.getPickupRequestsByUser(userId);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Get pickup request by ID' })
  @ApiParam({
    name: 'id',
    description: 'Pickup request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Pickup request details',
    type: PickupRequestResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pickup request not found',
  })
  async findOne(@Param('id') id: string): Promise<PickupRequestResponseDto> {
    return this.pickupRequestsService.getPickupRequestById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update pickup request status' })
  @ApiParam({
    name: 'id',
    description: 'Pickup request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description: 'Status update data',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['QUOTED', 'CONFIRMED', 'PICKED'],
          example: 'QUOTED',
        },
        price: {
          type: 'number',
          example: 25.5,
          description: 'Optional price for the pickup service',
        },
      },
      required: ['status'],
    },
  })
  @ApiOkResponse({
    description: 'Pickup request status updated successfully',
    type: PickupRequestResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pickup request not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status value',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; price?: number },
  ): Promise<PickupRequestResponseDto> {
    return this.pickupRequestsService.updateStatus(id, body.status, body.price);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pickup request by ID' })
  @ApiParam({
    name: 'id',
    description: 'Pickup request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Pickup request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Pickup request not found' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.pickupRequestsService.deletePickupRequest(id);
    return { message: 'Pickup request deleted successfully' };
  }
}
