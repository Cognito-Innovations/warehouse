/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureType, TrackingRequest } from './tracking-request.entity';
import { CreateTrackingRequestDto } from './dto/create-tracking-request.dto';
import { UpdateTrackingRequestDto } from './dto/update-tracking-request.dto';
import { TrackingRequestResponseDto } from './dto/tracking-request-response.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TrackingRequestsService {
  constructor(
    @InjectRepository(TrackingRequest)
    private readonly trackingRequestRepository: Repository<TrackingRequest>,
    private readonly usersService: UsersService,
  ) {}

  async createTrackingRequest(
    createTrackingRequestDto: CreateTrackingRequestDto,
  ): Promise<TrackingRequestResponseDto> {
    //TODO: Couldn't able to understand this logic
    const trackingRequest = this.trackingRequestRepository.create({
      ...(createTrackingRequestDto.courier_id
        ? { courier: { id: createTrackingRequestDto.courier_id } as any }
        : {}),
      feature_type: createTrackingRequestDto.feature_type,
      status: createTrackingRequestDto.status,
      feature_fid: createTrackingRequestDto.feature_fid,
      user: { id: createTrackingRequestDto.user },
    });

    const savedTrackingRequest =
      await this.trackingRequestRepository.save(trackingRequest);

    const { user, ...rest } = savedTrackingRequest;

    return {
      ...rest,
      user: user ? this.usersService.mapToUserResponseDto(user) : undefined,
    };
  }

  async getAllTrackingRequests(): Promise<TrackingRequestResponseDto[]> {
    const trackingRequests = await this.trackingRequestRepository.find({
      order: { created_at: 'DESC' },
      relations: ['user'],
    });

    return trackingRequests.map(({ user, ...rest }) => ({
      ...rest,
      user: user ? this.usersService.mapToUserResponseDto(user) : undefined,
    }));
  }

  async getTrackingRequestById(
    id: string,
  ): Promise<TrackingRequestResponseDto> {
    const trackingRequest = await this.trackingRequestRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!trackingRequest) {
      throw new NotFoundException(`Tracking request with id ${id} not found`);
    }

    const { user, ...rest } = trackingRequest;

    return {
      ...rest,
      user: user ? this.usersService.mapToUserResponseDto(user) : undefined,
    };
  }

  async getTrackingRequestsByUser(
    userId: string,
  ): Promise<TrackingRequestResponseDto[]> {
    const trackingRequests = await this.trackingRequestRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });

    return trackingRequests.map(({ user, ...rest }) => ({
      ...rest,
      user: user ? this.usersService.mapToUserResponseDto(user) : undefined,
    }));
  }

  async getTrackingRequestsByFeature(
    featureType: string,
    featureFid: string,
  ): Promise<TrackingRequestResponseDto[]> {
    const trackingRequests = await this.trackingRequestRepository.find({
      where: {
        feature_type: featureType as FeatureType,
        feature_fid: featureFid,
      },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });

    return trackingRequests.map(({ user, ...rest }) => ({
      ...rest,
      user: user ? this.usersService.mapToUserResponseDto(user) : undefined,
    }));
  }

  async updateTrackingRequest(
    id: string,
    updateTrackingRequestDto: UpdateTrackingRequestDto,
  ): Promise<TrackingRequestResponseDto> {
    const trackingRequest = await this.trackingRequestRepository.findOne({
      where: { id },
    });

    if (!trackingRequest) {
      throw new NotFoundException(`Tracking request with id ${id} not found`);
    }

    Object.assign(trackingRequest, updateTrackingRequestDto);
    const updatedTrackingRequest =
      await this.trackingRequestRepository.save(trackingRequest);

    const { user, ...rest } = updatedTrackingRequest;

    return {
      ...rest,
      user: user ? this.usersService.mapToUserResponseDto(user) : undefined,
    };
  }

  async deleteTrackingRequest(id: string): Promise<void> {
    const trackingRequest = await this.trackingRequestRepository.findOne({
      where: { id },
    });

    if (!trackingRequest) {
      throw new NotFoundException(`Tracking request with id ${id} not found`);
    }

    await this.trackingRequestRepository.remove(trackingRequest);
  }
}
