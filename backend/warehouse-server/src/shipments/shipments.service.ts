import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Shipment, ShipmentStatus } from './shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentResponseDto } from './dto/shipment-response.dto';
import { Package } from 'src/packages/entities';
import { TrackingRequestsService } from 'src/tracking-requests/tracking-requests.service';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';
import { mapToTrackingStatus } from './status-mapper';
import { DocumentsService } from 'src/documents/documents.service';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly dataSource: DataSource,
    private readonly trackingRequestsService: TrackingRequestsService,
    private readonly documentsService: DocumentsService,
  ) {}

  private generateShipmentNo(countryCode: string): string {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `S${year}${randomDigits}${countryCode.toUpperCase()}`;
  }

  private generateTrackingNo(): string {
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    return `RB${randomDigits}`;
  }

  async createShipment(
    createShipmentDto: CreateShipmentDto,
    userId: string,
  ): Promise<ShipmentResponseDto> {
    const { packageIds } = createShipmentDto;

    if (!packageIds || packageIds.length === 0) {
      throw new BadRequestException(
        'At least one package ID must be provided.'
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const packages = await queryRunner.manager.getRepository(Package).find({
        where: packageIds.map((id) => ({ id })),
        relations: ['user', 'country', 'items'],
      });

      if (packages.length !== packageIds.length) {
        throw new NotFoundException('One or more packages not found.');
      }

      const firstPackage = packages[0];
      const country = firstPackage.country;
      const user = firstPackage.user;

      if (user.id !== userId) {
        throw new BadRequestException(
          'Packages do not belong to the authenticated user.',
        );
      }

      for (const pkg of packages) {
        if (pkg.user.id !== userId) {
          throw new BadRequestException(
            'All packages must belong to the same user.',
          );
        }
        if (pkg.country.id !== country.id) {
          throw new BadRequestException(
            'All packages must be from the same country.',
          );
        }
        if (pkg.status !== 'Ready To Send') {
          throw new BadRequestException(
            `Package ${pkg.tracking_no} is not in 'Ready To Send' status.`,
          );
        }
        if (pkg.shipment_id) {
          throw new BadRequestException(
            `Package ${pkg.tracking_no} is already part of a shipment.`,
          );
        }
      }

      const customs_value = packages.reduce((sum, pkg) => {
        if (!pkg.items) return sum;
        const pkgValue = pkg.items.reduce(
          (itemSum, item) => itemSum + Number(item.total_price || 0),
          0,
        );
        return sum + pkgValue;
      }, 0);

      const shipmentNo = this.generateShipmentNo(country.code || 'IN');
      const trackingNo = this.generateTrackingNo();

      const newShipment = queryRunner.manager.create(Shipment, {
        shipment_no: shipmentNo,
        tracking_no: trackingNo,
        status: ShipmentStatus.SHIP_REQUEST,
        user,
        country,
        customs_value,
      });

      const savedShipment = await queryRunner.manager.save(newShipment);

      await this.trackingRequestsService.createTrackingRequest({
        feature_type: FeatureType.Shipment,
        feature_fid: savedShipment.id,
        status: mapToTrackingStatus(savedShipment.status),
        user: savedShipment.user.id,
      });

      for (const pkg of packages) {
        pkg.shipment = savedShipment;
        pkg.shipment_id = savedShipment.id;
        await queryRunner.manager.save(pkg);
      }

      await queryRunner.commitTransaction();

      return savedShipment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllShipments() {
    const shipments = await this.shipmentRepository.find({
      order: { created_at: 'DESC' },
      relations: ['user', 'packages', 'packages.items'],
    });

    return shipments;
  }

  async getShipmentsByUser(userId: string): Promise<ShipmentResponseDto[]> {
    const shipments = await this.shipmentRepository.find({
      where: { 
        user: { id: userId },
      },
      relations: ['country', 'packages'],
      order: { created_at: 'DESC' },
    });

    return shipments;
  }

  async getShipmentByShipmentNo(
    shipmentNo: string,
  ): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({
      where: { shipment_no: shipmentNo },
      relations: ['user', 'packages', 'country', 'packages.items'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with code ${shipmentNo} not found`);
    }

    const tracking_requests =
      await this.trackingRequestsService.getTrackingRequestsByFeature(
        FeatureType.Shipment,
        shipment.id,
      );

    return {
      ...shipment,
      tracking_requests,
    };
  }

  async getShipmentsByStatus(status: string): Promise<ShipmentResponseDto[]> {
    const enumStatus = ShipmentStatus[status as keyof typeof ShipmentStatus];
    if (!enumStatus) {
      throw new BadRequestException(`Invalid shipment status: ${status}`);
    }

    const shipments = await this.shipmentRepository.find({
      where: { status: enumStatus },
      relations: ['user', 'packages', 'country'],
      order: { created_at: 'DESC' }
    })

    return shipments;
  }

  async updateStatus(
    id: string,
    status: ShipmentStatus,
  ): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with id ${id} not found`);
    }

    const normalizedStatus =
      status.toUpperCase() as keyof typeof ShipmentStatus;

    if (!(normalizedStatus in ShipmentStatus)) {
      throw new Error(`Invalid status: ${status}`);
    }

    shipment.status = ShipmentStatus[normalizedStatus];

    const updatedShipment = await this.shipmentRepository.save(shipment);

    await this.trackingRequestsService.createTrackingRequest({
      feature_type: FeatureType.Shipment,
      feature_fid: id,
      status: mapToTrackingStatus(updatedShipment.status),
      user: updatedShipment.user.id,
    });

    return updatedShipment;
  }

  async updateShipmentById(id: string, payload: UpdateShipmentDto) {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException(`Shipment with id ${id} not found`);
    }

    const total_volumetric_weight = 
      (payload.length * payload.width * payload.height) / 5000;

    shipment.total_weight = payload.weight;
    shipment.length = payload.length;
    shipment.width = payload.width;
    shipment.height = payload.height;
    shipment.total_volumetric_weight = total_volumetric_weight;

    await this.shipmentRepository.save(shipment);

    return shipment;
  }

  async addPaymentSlip(
    shipmentId: string,
    dto: {
      url: string;
      original_filename: string;
      document_type?: string;
      file_size?: number;
      mime_type?: string;
    },
    userId: string,
  ): Promise<ShipmentResponseDto> {
    await this.documentsService.create({
      uploaded_by: userId,
      feature_type: FeatureType.Shipment,
      feature_fid: shipmentId,
      document_name: 'Payment Slip',
      original_filename: dto.original_filename,
      document_url: dto.url,
      document_type: dto.document_type || 'slip',
      file_size: dto.file_size,
      mime_type: dto.mime_type,
      category: 'PAYMENT',
      is_required: false,
    });

    return this.getShipmentByShipmentNo(
      (
        await this.shipmentRepository.findOneOrFail({
          where: { id: shipmentId },
        })
      ).shipment_no,
    );
  }

  async deleteShipment(id: string): Promise<{ message: string }> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with id ${id} not found`);
    }

    await this.shipmentRepository.delete(id);

    return { message: 'Shipment deleted successfully' };
  }
}
