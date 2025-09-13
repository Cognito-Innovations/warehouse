import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TrackingRequestsService } from './tracking-requests.service';
import { CreateTrackingRequestDto } from './dto/create-tracking-request.dto';
import { UpdateTrackingRequestDto } from './dto/update-tracking-request.dto';
import { TrackingRequestResponseDto } from './dto/tracking-request-response.dto';

@ApiTags('Tracking Requests')
@Controller('tracking-requests')
export class TrackingRequestsController {
  constructor(
    private readonly trackingRequestsService: TrackingRequestsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tracking request' })
  @ApiResponse({
    status: 201,
    description: 'Tracking request created successfully',
    type: TrackingRequestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiBody({
    type: CreateTrackingRequestDto,
    examples: {
      Example1: {
        summary: 'Create tracking request for a pickup',
        value: {
          user: '123e4567-e89b-12d3-a456-426614174001',
          feature_type: 'pickup-request',
          courier_id: '123e4567-e89b-12d3-a456-426614174002',
          status: 'requested',
          feature_fid: '123e4567-e89b-12d3-a456-426614174003',
        },
      },
    },
  })
  async create(
    @Body()
    createTrackingRequestDto: CreateTrackingRequestDto,
  ): Promise<TrackingRequestResponseDto> {
    return this.trackingRequestsService.createTrackingRequest(
      createTrackingRequestDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracking requests' })
  @ApiResponse({
    status: 200,
    description: 'List of all tracking requests',
    type: [TrackingRequestResponseDto],
  })
  async findAll(): Promise<TrackingRequestResponseDto[]> {
    return this.trackingRequestsService.getAllTrackingRequests();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get tracking requests by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'User ID to filter tracking requests',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tracking requests for the specified user',
    type: [TrackingRequestResponseDto],
  })
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<TrackingRequestResponseDto[]> {
    return this.trackingRequestsService.getTrackingRequestsByUser(userId);
  }

  @Get('feature/:featureType/:featureFid')
  @ApiOperation({ summary: 'Get tracking requests by feature type and ID' })
  @ApiParam({
    name: 'featureType',
    description: 'Type of feature being tracked',
    example: 'pickup-request',
  })
  @ApiParam({
    name: 'featureFid',
    description: 'Feature ID being tracked',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tracking requests for the specified feature',
    type: [TrackingRequestResponseDto],
  })
  async findByFeature(
    @Param('featureType')
    featureType: string,
    @Param('featureFid')
    featureFid: string,
  ): Promise<TrackingRequestResponseDto[]> {
    return this.trackingRequestsService.getTrackingRequestsByFeature(
      featureType,
      featureFid,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tracking request by ID' })
  @ApiParam({
    name: 'id',
    description: 'Tracking request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking request details',
    type: TrackingRequestResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tracking request not found',
  })
  async findOne(@Param('id') id: string): Promise<TrackingRequestResponseDto> {
    return this.trackingRequestsService.getTrackingRequestById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tracking request' })
  @ApiParam({
    name: 'id',
    description: 'Tracking request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking request updated successfully',
    type: TrackingRequestResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tracking request not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiBody({
    type: UpdateTrackingRequestDto,
    examples: {
      Example1: {
        summary: 'Update tracking request status',
        value: {
          status: 'shipped',
        },
      },
    },
  })
  async update(
    @Param('id')
    id: string,
    @Body()
    updateTrackingRequestDto: UpdateTrackingRequestDto,
  ): Promise<TrackingRequestResponseDto> {
    return this.trackingRequestsService.updateTrackingRequest(
      id,
      updateTrackingRequestDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tracking request' })
  @ApiParam({
    name: 'id',
    description: 'Tracking request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tracking request deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Tracking request deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tracking request not found',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.trackingRequestsService.deleteTrackingRequest(id);
    return { message: 'Tracking request deleted successfully' };
  }
}
