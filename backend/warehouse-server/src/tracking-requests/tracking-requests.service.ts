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

    return {
      id: savedTrackingRequest.id,
      courier: savedTrackingRequest.courier,
      user: savedTrackingRequest.user 
        ? this.usersService.mapToUserResponseDto(savedTrackingRequest.user) 
        : undefined,
      status: savedTrackingRequest.status,
      created_at: savedTrackingRequest.created_at,
      updated_at: savedTrackingRequest.updated_at,
    };
  }

  async getAllTrackingRequests(): Promise<TrackingRequestResponseDto[]> {
    const trackingRequests = await this.trackingRequestRepository.find({
      order: { created_at: 'DESC' },
      relations: ['user'],
    });

    return trackingRequests.map((request) => ({
      id: request.id,
      courier: request.courier,
      user: request.user 
        ? this.usersService.mapToUserResponseDto(request.user) 
        : undefined,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at,
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

    return {
      id: trackingRequest.id,
      courier: trackingRequest.courier,
      user: trackingRequest.user 
        ? this.usersService.mapToUserResponseDto(trackingRequest.user) 
        : undefined,
      status: trackingRequest.status,
      created_at: trackingRequest.created_at,
      updated_at: trackingRequest.updated_at,
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

    return trackingRequests.map((request) => ({
      id: request.id,
      courier: request.courier,
      user: request.user 
        ? this.usersService.mapToUserResponseDto(request.user) 
        : undefined,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at,
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

    return trackingRequests.map((request) => ({
      id: request.id,
      courier: request.courier,
      user: request.user 
        ? this.usersService.mapToUserResponseDto(request.user) 
        : undefined,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at,
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

    return {
      id: updatedTrackingRequest.id,
      courier: updatedTrackingRequest.courier,
      user: updatedTrackingRequest.user 
        ? this.usersService.mapToUserResponseDto(updatedTrackingRequest.user) 
        : undefined,
      status: updatedTrackingRequest.status,
      created_at: updatedTrackingRequest.created_at,
      updated_at: updatedTrackingRequest.updated_at,
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
