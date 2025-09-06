import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PickupRequest } from './pickup-request.entity';
import { CreatePickupRequestDto } from './dto/create-pickup-request.dto';
import { PickupRequestResponseDto } from './dto/pickup-request-response.dto';
import {
  FeatureType,
  Status,
  TrackingRequest,
} from 'src/tracking-requests/tracking-request.entity';

@Injectable()
export class PickupRequestsService {
  constructor(
    @InjectRepository(PickupRequest)
    private readonly pickupRequestRepository: Repository<PickupRequest>,
    @InjectRepository(TrackingRequest)
    private readonly dataSource: DataSource,
  ) {}

  async createPickupRequest(
    createPickupRequestDto: CreatePickupRequestDto,
  ): Promise<PickupRequestResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pickupRequest = queryRunner.manager.create(PickupRequest, {
        ...createPickupRequestDto,
      });

      const savedPickupRequest = await queryRunner.manager.save(
        PickupRequest,
        pickupRequest,
      );

      const trackingRequest = queryRunner.manager.create(TrackingRequest, {
        user: { id: createPickupRequestDto.user_id },
        admin: { id: createPickupRequestDto.user_id },
        feature_type: FeatureType.PickupRequest,
        status: Status.Requested,
        feature_fid: savedPickupRequest.id,
        count: 1,
      });

      await queryRunner.manager.save(TrackingRequest, trackingRequest);

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

      return {
        id: pickupRequestWithRelations.id,
        country: pickupRequestWithRelations.country?.country,
        pickup_address: pickupRequestWithRelations.pickup_address,
        supplier_name: pickupRequestWithRelations.supplier_name,
        supplier_phone_number: pickupRequestWithRelations.supplier_phone_number,
        alt_supplier_phone_number:
          pickupRequestWithRelations.alt_supplier_phone_number,
        pcs_box: pickupRequestWithRelations.pcs_box,
        est_weight: pickupRequestWithRelations.est_weight,
        pkg_details: pickupRequestWithRelations.pkg_details,
        remarks: pickupRequestWithRelations.remarks,
        price: pickupRequestWithRelations.price,
        created_at: pickupRequestWithRelations.created_at,
        updated_at: pickupRequestWithRelations.updated_at,
        user: pickupRequestWithRelations.user
          ? {
              email: pickupRequestWithRelations.user.email,
              name: pickupRequestWithRelations.user.name,
              phone_number: pickupRequestWithRelations.user.phone_number,
              country: pickupRequestWithRelations.user.country,
              created_at: pickupRequestWithRelations.user.created_at,
            }
          : undefined,
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

      return pickupRequests.map((request) => ({
        id: request.id,
        country: request.country?.country,
        pickup_address: request.pickup_address,
        supplier_name: request.supplier_name,
        supplier_phone_number: request.supplier_phone_number,
        alt_supplier_phone_number: request.alt_supplier_phone_number,
        pcs_box: request.pcs_box,
        est_weight: request.est_weight,
        pkg_details: request.pkg_details,
        remarks: request.remarks,
        price: request.price,
        created_at: request.created_at,
        updated_at: request.updated_at,
        user: request.user
          ? {
              email: request.user.email,
              name: request.user.name,
              phone_number: request.user.phone_number,
              country: request.user.country,
              created_at: request.user.created_at,
            }
          : undefined,
      }));
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

      return pickupRequests.map((request) => ({
        id: request.id,
        country: request.country?.country,
        pickup_address: request.pickup_address,
        supplier_name: request.supplier_name,
        supplier_phone_number: request.supplier_phone_number,
        alt_supplier_phone_number: request.alt_supplier_phone_number,
        pcs_box: request.pcs_box,
        est_weight: request.est_weight,
        pkg_details: request.pkg_details,
        remarks: request.remarks,
        price: request.price,
        created_at: request.created_at,
        updated_at: request.updated_at,
        user: request.user
          ? {
              email: request.user.email,
              name: request.user.name,
              phone_number: request.user.phone_number,
              country: request.user.country,
              created_at: request.user.created_at,
            }
          : undefined,
      }));
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

      return {
        id: pickupRequest.id,
        country: pickupRequest.country?.country,
        pickup_address: pickupRequest.pickup_address,
        supplier_name: pickupRequest.supplier_name,
        supplier_phone_number: pickupRequest.supplier_phone_number,
        alt_supplier_phone_number: pickupRequest.alt_supplier_phone_number,
        pcs_box: pickupRequest.pcs_box,
        est_weight: pickupRequest.est_weight,
        pkg_details: pickupRequest.pkg_details,
        remarks: pickupRequest.remarks,
        price: pickupRequest.price,
        created_at: pickupRequest.created_at,
        updated_at: pickupRequest.updated_at,
        user: pickupRequest.user
          ? {
              email: pickupRequest.user.email,
              name: pickupRequest.user.name,
              phone_number: pickupRequest.user.phone_number,
              country: pickupRequest.user.country,
              created_at: pickupRequest.user.created_at,
            }
          : undefined,
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
        pickupRequest.price = price;
      }

      // Update the status of the pickup request
      switch (status.toUpperCase()) {
        case 'QUOTED':
        case 'CONFIRMED':
        case 'PICKED':
          // Status validation - you can add more logic here if needed
          break;
        default:
          throw new BadRequestException(`Invalid status: ${status}`);
      }

      const updatedPickupRequest = await queryRunner.manager.save(
        PickupRequest,
        pickupRequest,
      );

      // Update the corresponding tracking request
      const trackingRequest = await queryRunner.manager.findOne(
        TrackingRequest,
        {
          where: {
            feature_type: FeatureType.PickupRequest,
            feature_fid: id,
          },
        },
      );

      if (trackingRequest) {
        // Map pickup request status to tracking request status
        let trackingStatus: Status;
        switch (status.toUpperCase()) {
          case 'QUOTED':
            trackingStatus = Status.Quoted;
            break;
          case 'CONFIRMED':
            trackingStatus = Status.QuotationConfirmed;
            break;
          case 'PICKED':
            trackingStatus = Status.Shipped;
            break;
          default:
            trackingStatus = Status.InReview;
        }

        trackingRequest.status = trackingStatus;
        await queryRunner.manager.save(TrackingRequest, trackingRequest);
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

      return {
        id: pickupRequestWithRelations.id,
        country: pickupRequestWithRelations.country?.country,
        pickup_address: pickupRequestWithRelations.pickup_address,
        supplier_name: pickupRequestWithRelations.supplier_name,
        supplier_phone_number: pickupRequestWithRelations.supplier_phone_number,
        alt_supplier_phone_number:
          pickupRequestWithRelations.alt_supplier_phone_number,
        pcs_box: pickupRequestWithRelations.pcs_box,
        est_weight: pickupRequestWithRelations.est_weight,
        pkg_details: pickupRequestWithRelations.pkg_details,
        remarks: pickupRequestWithRelations.remarks,
        price: pickupRequestWithRelations.price,
        created_at: pickupRequestWithRelations.created_at,
        updated_at: pickupRequestWithRelations.updated_at,
        user: pickupRequestWithRelations.user
          ? {
              email: pickupRequestWithRelations.user.email,
              name: pickupRequestWithRelations.user.name,
              phone_number: pickupRequestWithRelations.user.phone_number,
              country: pickupRequestWithRelations.user.country,
              created_at: pickupRequestWithRelations.user.created_at,
            }
          : undefined,
      };
    } catch (error) {
      // Rollback the transaction on any error
      await queryRunner.rollbackTransaction();

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
}
