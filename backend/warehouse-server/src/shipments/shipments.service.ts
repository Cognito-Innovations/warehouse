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

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly dataSource: DataSource,
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
        relations: ['user', 'country'],
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

      const shipmentNo = this.generateShipmentNo(country.code || 'IN');
      const trackingNo = this.generateTrackingNo();

      const newShipment = queryRunner.manager.create(Shipment, {
        shipment_no: shipmentNo,
        tracking_no: trackingNo,
        status: ShipmentStatus.SHIP_REQUEST,
        user: user,
        country: country,
      });

      const savedShipment = await queryRunner.manager.save(newShipment);

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
      relations: ['user', 'packages', 'country'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with code ${shipmentNo} not found`);
    }

    return shipment;
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
}
