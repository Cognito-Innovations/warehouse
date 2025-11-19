import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PickupRequest, PickupRequestStatus } from './pickup-request.entity';
import { CreatePickupRequestDto } from './dto/create-pickup-request.dto';
import { PickupRequestResponseDto } from './dto/pickup-request-response.dto';
import {
  FeatureType,
  TrackingRequest,
  TrackingStatus,
} from 'src/tracking-requests/tracking-request.entity';
import { TrackingRequestsService } from 'src/tracking-requests/tracking-requests.service';
import { mapPickupToTrackingStatus } from './status-mapper';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PickupRequestsService {
  constructor(
    @InjectRepository(PickupRequest)
    private readonly pickupRequestRepository: Repository<PickupRequest>,
    private readonly dataSource: DataSource,
    private readonly trackingRequestsService: TrackingRequestsService,
    private readonly usersService: UsersService,
  ) {}

  async createPickupRequest(
    createPickupRequestDto: CreatePickupRequestDto,
  ): Promise<PickupRequestResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pickupRequestData = createPickupRequestDto;
      const pickupRequest = queryRunner.manager.create(PickupRequest, {
        ...pickupRequestData,
        user: { id: createPickupRequestDto.user_id },
        country: { id: createPickupRequestDto.country_id },
      });

      const savedPickupRequest = await queryRunner.manager.save(
        PickupRequest,
        pickupRequest,
      );

      await this.trackingRequestsService.createTrackingRequest({
        feature_type: FeatureType.PickupRequest,
        feature_fid: savedPickupRequest.id,
        status: TrackingStatus.Requested,
        user: createPickupRequestDto.user_id,
      });

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Load the pickup request with relations after transaction
      const pickupRequestWithRelations =
        await this.pickupRequestRepository.findOne({
          where: { id: savedPickupRequest.id },
          relations: ['user', 'country'],
        });

      if (!pickupRequestWithRelations) {
        throw new NotFoundException(
          'Failed to load pickup request with relations',
        );
      }

      const { country, ...rest } = pickupRequestWithRelations;

      return {
        ...rest,
        country: country?.name,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create pickup request: ${(error as Error).message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getAllPickupRequests(): Promise<PickupRequestResponseDto[]> {
    try {
      const pickupRequests = await this.pickupRequestRepository.find({
        order: { created_at: 'DESC' },
        relations: ['user', 'country'],
      });

      return pickupRequests.map((request) => {
        const { country, user, ...rest } = request;

        return {
          ...rest,
          country: country?.name,
          user: user
            ? this.usersService.mapToUserResponseDto(request.user)
            : undefined,
        }
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch pickup requests: ${(error as Error).message}`,
      );
    }
  }

  async getPickupRequestsByUser(
    userId: string,
  ): Promise<PickupRequestResponseDto[]> {
    try {
      const pickupRequests = await this.pickupRequestRepository.find({
        where: { user: { id: userId } },
        order: { created_at: 'DESC' },
        relations: ['user', 'country'],
      });

      return pickupRequests.map((request) => {
        const { country, ...rest } = request;

        return {
          ...rest,
          country: country?.name,
        };
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch pickup requests for user: ${(error as Error).message}`,
      );
    }
  }

  async getPickupRequestById(id: string): Promise<PickupRequestResponseDto> {
    try {
      const pickupRequest = await this.pickupRequestRepository.findOne({
        where: { id },
        relations: ['user', 'country'],
      });

      if (!pickupRequest) {
        throw new NotFoundException(`Pickup request with id ${id} not found`);
      }

      const trackingRequests =
        await this.trackingRequestsService.getTrackingRequestsByFeature(
          FeatureType.PickupRequest,
          pickupRequest.id,
        );

      const { country, user, ...rest } = pickupRequest;

      return {
        ...rest,
        country: country?.name,
        user: user
          ? this.usersService.mapToUserResponseDto(pickupRequest.user)
          : undefined,
        tracking_requests: trackingRequests,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch pickup request: ${(error as Error).message}`,
      );
    }
  }

  async updateStatus(
    id: string,
    status: string,
    price?: number,
  ): Promise<PickupRequestResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pickupRequest = await queryRunner.manager.findOne(PickupRequest, {
        where: { id },
        relations: ['user', 'country'],
      });

      if (!pickupRequest) {
        throw new NotFoundException(`Pickup request with id ${id} not found`);
      }

      if (price !== undefined) {
        pickupRequest.price = Number(price.toFixed(2));
      }

      // Update the status of the pickup request
      switch (status.toUpperCase()) {
        case 'QUOTED':
          pickupRequest.status = PickupRequestStatus.Quoted;
          break;
        case 'CONFIRMED':
          pickupRequest.status = PickupRequestStatus.Confirmed;
          break;
        case 'PICKED':
          pickupRequest.status = PickupRequestStatus.Picked;
          break;
        case 'CANCELLED':
          pickupRequest.status = PickupRequestStatus.Cancelled;
          break;
        default:
          throw new BadRequestException(`Invalid status: ${status}`);
      }

      const updatedPickupRequest = await queryRunner.manager.save(
        PickupRequest,
        pickupRequest,
      );

      if (updatedPickupRequest.user) {
        const trackingRequest = queryRunner.manager.create(TrackingRequest, {
          feature_type: FeatureType.PickupRequest,
          feature_fid: updatedPickupRequest.id,
          status: mapPickupToTrackingStatus(updatedPickupRequest.status),
          user: updatedPickupRequest.user.id as any,
        });
        await queryRunner.manager.save(trackingRequest);
      }

      // Commit the transaction
      await queryRunner.commitTransaction();

      // Load the updated pickup request with relations after transaction
      const pickupRequestWithRelations =
        await this.pickupRequestRepository.findOne({
          where: { id: updatedPickupRequest.id },
          relations: ['user', 'country'],
        });

      if (!pickupRequestWithRelations) {
        throw new NotFoundException(
          'Failed to load updated pickup request with relations',
        );
      }

      const trackingRequests =
        await this.trackingRequestsService.getTrackingRequestsByFeature(
          FeatureType.PickupRequest,
          pickupRequestWithRelations.id,
        );

      const { country, user, ...rest } = pickupRequestWithRelations;

      return {
        ...rest,
        country: country?.name,
        user: user
          ? this.usersService.mapToUserResponseDto(
              pickupRequestWithRelations.user
            )
          : undefined,
        tracking_requests: trackingRequests,
      };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update pickup request status: ${(error as Error).message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deletePickupRequest(id: string): Promise<void> {
    const pickupRequest = await this.pickupRequestRepository.findOne({
      where: { id },
    });
    if (!pickupRequest) {
      throw new NotFoundException(`Pickup request with id ${id} not found`);
    }

    await this.pickupRequestRepository.remove(pickupRequest);
  }
}
