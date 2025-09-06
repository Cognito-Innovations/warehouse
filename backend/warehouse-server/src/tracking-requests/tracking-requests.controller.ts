import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrackingRequestsService } from './tracking-requests.service';
import { CreateTrackingRequestDto } from './dto/create-tracking-request.dto';
import { UpdateTrackingRequestDto } from './dto/update-tracking-request.dto';
import { TrackingRequestResponseDto } from './dto/tracking-request-response.dto';

@Controller('tracking-requests')
export class TrackingRequestsController {
  constructor(
    private readonly trackingRequestsService: TrackingRequestsService,
  ) {}

  @Post()
  async create(
    @Body()
    createTrackingRequestDto: CreateTrackingRequestDto,
  ): Promise<TrackingRequestResponseDto> {
    return this.trackingRequestsService.createTrackingRequest(
      createTrackingRequestDto,
    );
  }

  @Get()
  async findAll(): Promise<TrackingRequestResponseDto[]> {
    return this.trackingRequestsService.getAllTrackingRequests();
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<TrackingRequestResponseDto[]> {
    return this.trackingRequestsService.getTrackingRequestsByUser(userId);
  }

  @Get('feature/:featureType/:featureFid')
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
  async findOne(@Param('id') id: string): Promise<TrackingRequestResponseDto> {
    return this.trackingRequestsService.getTrackingRequestById(id);
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.trackingRequestsService.deleteTrackingRequest(id);
    return { message: 'Tracking request deleted successfully' };
  }
}
