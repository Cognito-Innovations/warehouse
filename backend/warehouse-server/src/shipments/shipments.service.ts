import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  EntityManager,
  FindOptionsWhere,
} from 'typeorm';
import { Shipment, ShipmentStatus } from './shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentResponseDto } from './dto/shipment-response.dto';
import { Package } from 'src/packages/entities';
import { TrackingRequestsService } from 'src/tracking-requests/tracking-requests.service';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';
import { mapToTrackingStatus } from './status-mapper';
import { DocumentsService } from 'src/documents/documents.service';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Rack } from 'src/racks/rack.entity';
import { InvoicesService } from 'src/invoice/invoices.service';
import { Invoice, InvoiceStatus } from 'src/invoice/entities/invoice.entity';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { CreateShipmentInvoiceDto } from './dto/create-shipment-invoice.dto';
import { ShipmentPiece } from './shipment-piece.entity';
import { ShipmentSequence } from './shipment-sequence.entity';
import { UserContextService } from 'src/shared/user-context.service';

export type FormattedInvoice = {
  amount: string;
  total: string;
  products?: undefined;
  id: string;
  invoice_no: string;
  status: InvoiceStatus;
  created_at: number;
  updated_at: number;
} & Omit<
  Partial<Invoice>,
  'amount' | 'total' | 'products' | 'id' | 'invoice_no' | 'status'
>;

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Rack)
    private readonly rackRepository: Repository<Rack>,
    @InjectRepository(ShipmentPiece)
    private readonly shipmentPieceRepository: Repository<ShipmentPiece>,
    private readonly dataSource: DataSource,
    private readonly trackingRequestsService: TrackingRequestsService,
    private readonly documentsService: DocumentsService,
    private readonly invoicesService: InvoicesService,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly userContextService: UserContextService,
  ) {}

  async getShipmentsCountByStatus(
    status: ShipmentStatus,
    countryId?: string,
  ): Promise<number> {
    const where: FindOptionsWhere<Shipment> = { status };

    if (countryId) {
      where.country = { id: countryId };
    }

    return this.shipmentRepository.count({ where });
  }

  private async generateShipmentNo(
    countryCode: string,
    manager: EntityManager,
  ): Promise<string> {
    const year = new Date().getFullYear();
    const country = countryCode.toUpperCase();

    let sequence = await manager.findOne(ShipmentSequence, {
      where: { country_code: country, year },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sequence) {
      try {
        const newSequence = manager.create(ShipmentSequence, {
          country_code: country,
          year,
          last_value: 0,
        });
        sequence = await manager.save(newSequence);
      } catch (error) {
        console.error('Error creating shipment sequence, retrying...', error);
        sequence = await manager.findOne(ShipmentSequence, {
          where: { country_code: country, year },
          lock: { mode: 'pessimistic_write' },
        });

        if (!sequence) {
          throw new Error(
            `Failed to generate shipment sequence for ${country}-${year}`,
          );
        }
      }
    }

    sequence.last_value += 1;
    await manager.save(sequence);

    const padded = String(sequence.last_value).padStart(5, '0');

    return `S${year}${padded}${country}`;
  }

  private generateTrackingNo(): string {
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    return `UG${randomDigits}`;
  }

  private async formatInvoice(
    invoice: Invoice | null,
    shipmentUserId: string,
    viewerId?: string,
  ): Promise<FormattedInvoice | null> {
    if (!invoice) return null;

    const isAdminView = viewerId && viewerId !== shipmentUserId;

    const amountStr: string = isAdminView
      ? `${invoice.amount} USD`
      : await this.userPreferencesService.getFormattedConvertedPrice(
          shipmentUserId,
          invoice.amount,
        );

    const totalStr: string = isAdminView
      ? `${invoice.total} USD`
      : await this.userPreferencesService.getFormattedConvertedPrice(
          shipmentUserId,
          invoice.total,
        );

    return {
      ...invoice,
      products: undefined,
      amount: amountStr,
      total: totalStr,
    };
  }

  async createShipment(
    createShipmentDto: CreateShipmentDto,
    userId: string,
  ): Promise<ShipmentResponseDto> {
    const { packageIds } = createShipmentDto;

    if (!packageIds || packageIds.length === 0) {
      throw new BadRequestException(
        'At least one package ID must be provided.',
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

      const shipmentNo = await this.generateShipmentNo(
        country.code || 'IN',
        queryRunner.manager,
      );
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

      const initialWeight = packages.reduce(
        (sum, pkg) => sum + parseFloat(String(pkg.total_weight || '0')),
        0,
      );
      const initialPiece = queryRunner.manager.create(ShipmentPiece, {
        piece_number: 1,
        weight: initialWeight,
        length: 0,
        width: 0,
        height: 0,
        volumetric_weight: 0,
        shipment: savedShipment,
      });
      await queryRunner.manager.save(initialPiece);

      savedShipment.total_weight = initialWeight;
      savedShipment.total_volumetric_weight = 0;
      await queryRunner.manager.save(savedShipment);

      await queryRunner.commitTransaction();

      return savedShipment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllShipments(userId?: string) {
    const where: FindOptionsWhere<Shipment> = {};

    let countryId: string | null = null;

    if (userId) {
      countryId =
        await this.userContextService.getUserPreferredCountryId(userId);
    }

    if (countryId) {
      where.country = { id: countryId };
    }

    const shipments = await this.shipmentRepository.find({
      where: where,
      order: { created_at: 'DESC' },
      relations: ['user', 'packages', 'packages.items', 'country'],
    });

    const shipmentsWithInvoices = await Promise.all(
      shipments.map(async (shipment) => {
        const invoice = await this.invoicesService.getInvoiceByShipmentId(
          shipment.id,
        );

        return {
          ...shipment,
          invoice,
        };
      }),
    );

    return shipmentsWithInvoices;
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
    viewerId?: string,
  ): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({
      where: { shipment_no: shipmentNo },
      relations: [
        'user',
        'packages',
        'country',
        'pieces',
        'packages.items',
        'user.address',
        'user.preference',
        'shipmentExportBox',
        'shipmentExportBox.shipmentExport',
      ],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with code ${shipmentNo} not found`);
    }

    const [trackingRequestsResult, documentsResult, invoiceResult] =
      await Promise.allSettled([
        this.trackingRequestsService.getTrackingRequestsByFeature(
          FeatureType.Shipment,
          shipment.id,
        ),
        this.documentsService.findByFeature(FeatureType.Shipment, shipment.id),
        this.invoicesService.getInvoiceByShipmentId(shipment.id),
      ]);

    const trackingRequests =
      trackingRequestsResult.status === 'fulfilled'
        ? trackingRequestsResult.value
        : [];

    const allDocuments =
      documentsResult.status === 'fulfilled' ? documentsResult.value : [];

    const invoice =
      invoiceResult.status === 'fulfilled' ? invoiceResult.value : null;

    const paymentSlips = allDocuments.filter(
      (doc) => doc.category === 'PAYMENT',
    );
    const shipmentPhotos = allDocuments.filter(
      (doc) => doc.category === 'SHIPMENT_PHOTO',
    );

    const formattedInvoice = await this.formatInvoice(
      invoice,
      shipment.user.id,
      viewerId,
    );

    return {
      ...shipment,
      tracking_requests: trackingRequests,
      payment_slips: paymentSlips,
      shipment_photos: shipmentPhotos,
      invoice: formattedInvoice ?? undefined,
    };
  }

  async getShipmentsByStatus(
    status: string,
    userId?: string,
  ): Promise<ShipmentResponseDto[]> {
    const enumStatus = ShipmentStatus[status as keyof typeof ShipmentStatus];
    if (!enumStatus) {
      throw new BadRequestException(`Invalid shipment status: ${status}`);
    }

    const where: FindOptionsWhere<Shipment> = {
      status: enumStatus,
    };

    let countryId: string | null = null;

    if (userId) {
      countryId =
        await this.userContextService.getUserPreferredCountryId(userId);
    }

    if (countryId) {
      where.country = { id: countryId };
    }

    const shipments = await this.shipmentRepository.find({
      where: where,
      relations: ['user', 'packages', 'country', 'pieces'],
      order: { created_at: 'DESC' },
    });

    return shipments;
  }

  async createShipmentInvoice(id: string, dto: CreateShipmentInvoiceDto) {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!shipment) throw new NotFoundException('Shipment not found');

    const invoice = await this.invoicesService.createShipmentInvoice({
      shipment,
      charges: dto.charges,
      total: dto.total,
    });

    shipment.status = ShipmentStatus.PAYMENT_PENDING;
    await this.shipmentRepository.save(shipment);

    await this.trackingRequestsService.createTrackingRequest({
      feature_type: FeatureType.Shipment,
      feature_fid: shipment.id,
      status: mapToTrackingStatus(shipment.status),
      user: shipment.user.id,
    });

    return invoice;
  }

  async updateStatus(
    id: string,
    status: ShipmentStatus,
    viewerId?: string,
  ): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['country', 'user'],
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

    let invoice: Invoice | null = null;
    if (normalizedStatus === 'PAYMENT_APPROVED') {
      invoice = await this.invoicesService.getInvoiceByShipmentId(id);
      if (invoice) {
        invoice.status = InvoiceStatus.PAID;
        await this.invoicesService.updateInvoice(invoice);
      }
    }

    await this.trackingRequestsService.createTrackingRequest({
      feature_type: FeatureType.Shipment,
      feature_fid: id,
      status: mapToTrackingStatus(updatedShipment.status),
      user: updatedShipment.user.id,
    });

    if (!invoice) {
      invoice = await this.invoicesService.getInvoiceByShipmentId(
        updatedShipment.id,
      );
    }

    const formattedInvoice = await this.formatInvoice(
      invoice,
      shipment.user.id,
      viewerId,
    );

    return {
      ...updatedShipment,
      invoice: formattedInvoice ?? undefined,
    };
  }

  async updateShipmentById(id: string, payload: UpdateShipmentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const shipment = await queryRunner.manager.findOne(Shipment, {
        where: { id },
        relations: ['rack_slot', 'pieces'],
      });

      if (!shipment) {
        throw new NotFoundException(`Shipment with id ${id} not found`);
      }

      const oldRack = shipment.rack_slot;

      if (payload.customs_value !== undefined) {
        shipment.customs_value = payload.customs_value;
      }

      if (payload.dangerous_good !== undefined) {
        shipment.dangerous_good = payload.dangerous_good;
      }

      if (payload.pieces && payload.pieces.length > 0) {
        await queryRunner.manager.delete(ShipmentPiece, {
          shipment: { id },
        });

        const newPieces = payload.pieces.map((p) => {
          const volumetricWeight =
            p.volumetric_weight ?? (p.length * p.width * p.height) / 5000;

          const piece = queryRunner.manager.create(ShipmentPiece, {
            piece_number: p.piece_number,
            weight: p.weight,
            length: p.length,
            width: p.width,
            height: p.height,
            volumetric_weight: volumetricWeight,
          });

          piece.shipment = shipment;
          return piece;
        });

        shipment.pieces = newPieces;

        shipment.total_weight = newPieces.reduce(
          (sum, p) => sum + Number(p.weight),
          0,
        );

        shipment.total_volumetric_weight = newPieces.reduce(
          (sum, p) => sum + Number(p.volumetric_weight),
          0,
        );

        shipment.length = null;
        shipment.width = null;
        shipment.height = null;
      }

      if (
        payload.rack_slot !== undefined &&
        payload.rack_slot !== oldRack?.id
      ) {
        if (oldRack) {
          oldRack.count = Math.max(0, oldRack.count - 1);
          await queryRunner.manager.save(oldRack);
        }

        if (payload.rack_slot) {
          const newRack = await queryRunner.manager.findOne(Rack, {
            where: { id: payload.rack_slot },
          });

          if (!newRack) {
            throw new NotFoundException('New Rack not found');
          }

          newRack.count += 1;
          await queryRunner.manager.save(newRack);
          shipment.rack_slot = newRack;
        }
      }

      await queryRunner.manager.save(shipment);
      await queryRunner.commitTransaction();

      const responseShipment = await this.dataSource
        .getRepository(Shipment)
        .findOne({
          where: { id },
          relations: ['rack_slot', 'pieces'],
        });

      responseShipment?.pieces?.forEach((p) => {
        delete (p as any).shipment;
      });

      return responseShipment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removePackageFromShipment(shipmentId: string, packageId: string) {
    const pkg = await this.packageRepository.findOne({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    if (pkg.shipment_id !== shipmentId) {
      throw new NotFoundException('Package does not belong to this shipment');
    }

    pkg.shipment_id = null;
    await this.packageRepository.save(pkg);

    return {
      message: 'Package removed successfully',
    };
  }

  async addShipmentDocument(
    shipmentId: string,
    dto: {
      url: string;
      original_filename: string;
      document_type?: string;
      file_size?: number;
      mime_type?: string;
      category: 'PAYMENT' | 'SHIPMENT_PHOTO';
    },
    userId: string,
  ): Promise<ShipmentResponseDto> {
    await this.documentsService.create({
      uploaded_by: userId,
      feature_type: FeatureType.Shipment,
      feature_fid: shipmentId,
      document_name:
        dto.category === 'PAYMENT' ? 'Payment Slip' : 'Shipment Photo',
      original_filename: dto.original_filename,
      document_url: dto.url,
      document_type: dto.document_type || 'file',
      file_size: dto.file_size,
      mime_type: dto.mime_type,
      category: dto.category,
      is_required: false,
    });

    const shipment = await this.shipmentRepository.findOneOrFail({
      where: { id: shipmentId },
    });

    return this.getShipmentByShipmentNo(shipment.shipment_no);
  }

  async findByShipmentNumberAndStatus(
    shipmentNumber: string,
    status: ShipmentStatus,
    userId?: string,
  ): Promise<ShipmentResponseDto> {
    const where: FindOptionsWhere<Shipment> = {
      shipment_no: shipmentNumber,
      status,
    };

    let countryId: string | null = null;

    if (userId) {
      countryId =
        await this.userContextService.getUserPreferredCountryId(userId);
    }

    if (countryId) {
      where.country = { id: countryId };
    }

    const shipment = await this.shipmentRepository.findOne({ where });

    if (!shipment) {
      throw new NotFoundException(
        `Shipment with number ${shipmentNumber} and status ${status} not found.`,
      );
    }

    return shipment;
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
