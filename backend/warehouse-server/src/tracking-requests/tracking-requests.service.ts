/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureType, TrackingRequest } from './tracking-request.entity';
import { CreateTrackingRequestDto } from './dto/create-tracking-request.dto';
import { UpdateTrackingRequestDto } from './dto/update-tracking-request.dto';
import { TrackingRequestResponseDto } from './dto/tracking-request-response.dto';

@Injectable()
export class TrackingRequestsService {
  constructor(
    @InjectRepository(TrackingRequest)
    private readonly trackingRequestRepository: Repository<TrackingRequest>,
  ) {}

  async createTrackingRequest(
    createTrackingRequestDto: CreateTrackingRequestDto,
  ): Promise<TrackingRequestResponseDto> {
    const trackingRequest = this.trackingRequestRepository.create({
      feature_type: createTrackingRequestDto.feature_type,
      status: createTrackingRequestDto.status,
      feature_fid: createTrackingRequestDto.feature_fid,
      count: createTrackingRequestDto.count || 0,
      admin: { id: createTrackingRequestDto.admin } as any,
      user: { id: createTrackingRequestDto.user } as any,
    });

    const savedTrackingRequest =
      await this.trackingRequestRepository.save(trackingRequest);

    return {
      id: savedTrackingRequest.id,
      admin: savedTrackingRequest.admin,
      user: savedTrackingRequest.user,
      feature_type: savedTrackingRequest.feature_type,
      status: savedTrackingRequest.status,
      feature_fid: savedTrackingRequest.feature_fid,
      count: savedTrackingRequest.count,
      created_at: savedTrackingRequest.created_at,
      updated_at: savedTrackingRequest.updated_at,
    };
  }

  async getAllTrackingRequests(): Promise<TrackingRequestResponseDto[]> {
    const trackingRequests = await this.trackingRequestRepository.find({
      order: { created_at: 'DESC' },
      relations: ['admin', 'user'],
    });

    return trackingRequests.map((request) => ({
      id: request.id,
      admin: request.admin,
      user: request.user,
      feature_type: request.feature_type,
      status: request.status,
      feature_fid: request.feature_fid,
      count: request.count,
      created_at: request.created_at,
      updated_at: request.updated_at,
    }));
  }

  async getTrackingRequestById(
    id: string,
  ): Promise<TrackingRequestResponseDto> {
    const trackingRequest = await this.trackingRequestRepository.findOne({
      where: { id },
      relations: ['admin', 'user'],
    });

    if (!trackingRequest) {
      throw new NotFoundException(`Tracking request with id ${id} not found`);
    }

    return {
      id: trackingRequest.id,
      admin: trackingRequest.admin,
      user: trackingRequest.user,
      feature_type: trackingRequest.feature_type,
      status: trackingRequest.status,
      feature_fid: trackingRequest.feature_fid,
      count: trackingRequest.count,
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
      relations: ['admin', 'user'],
    });

    return trackingRequests.map((request) => ({
      id: request.id,
      admin: request.admin,
      user: request.user,
      feature_type: request.feature_type,
      status: request.status,
      feature_fid: request.feature_fid,
      count: request.count,
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
      relations: ['admin', 'user'],
    });

    return trackingRequests.map((request) => ({
      id: request.id,
      admin: request.admin,
      user: request.user,
      feature_type: request.feature_type,
      status: request.status,
      feature_fid: request.feature_fid,
      count: request.count,
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
      admin: updatedTrackingRequest.admin,
      user: updatedTrackingRequest.user,
      feature_type: updatedTrackingRequest.feature_type,
      status: updatedTrackingRequest.status,
      feature_fid: updatedTrackingRequest.feature_fid,
      count: updatedTrackingRequest.count,
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
