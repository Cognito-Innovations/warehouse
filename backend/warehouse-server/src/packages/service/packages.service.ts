import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package, PackageMeasurement } from '../entities';
import { CreatePackageDto } from '../dto/create-package.dto';
import { PackageResponseDto } from '../dto/package-response.dto';
import { User } from 'src/users/user.entity';
import { Country } from 'src/Countries/country.entity';
import { UserPreference } from 'src/user-preferences/user-preference.entity';
import { UpdatePackageDto } from '../dto/update-package.dto';
import { Rack } from 'src/racks/rack.entity';
import { DocumentsService } from 'src/documents/documents.service';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageMeasurement)
    private readonly packageMeasurementRepository: Repository<PackageMeasurement>,
    @InjectRepository(Rack)
    private readonly rackRepository: Repository<Rack>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>,
    private readonly documentsService: DocumentsService,
  ) {}

  private mapPackageToResponseDto(pkg: Package): PackageResponseDto {
    return {
      id: pkg.id,
      tracking_no: pkg.tracking_no,
      status: pkg.status,
      shipment_id: pkg.shipment_id,
      shipment_uuid: pkg.shipment_uuid,
      customer: pkg.user
        ? {
            id: pkg.user.id,
            email: pkg.user.email,
            name: pkg.user.name,
            suite_no: pkg.user.suite_no,
          }
        : undefined,
      vendor: pkg.vendor
        ? {
            id: pkg.vendor.id,
            supplier_name: pkg.vendor.supplier_name,
            country: pkg.vendor.country?.name,
          }
        : undefined,
      rack_slot: pkg.rack_slot
        ? {
            id: pkg.rack_slot.id,
            label: pkg.rack_slot.label,
            count: pkg.rack_slot.count,
            color: pkg.rack_slot.color,
          }
        : undefined,
      documents:
        pkg.documents?.map((doc) => ({
          id: doc.id,
          document_name: doc.document_name,
          document_url: doc.document_url,
          category: doc.category,
        })) || [],
      slot_info: pkg.slot_info,
      warehouse_location: pkg.warehouse_location,
      total_weight: pkg.total_weight,
      total_volumetric_weight: pkg.total_volumetric_weight,
      country: pkg.country,
      allow_customer_items: pkg.allow_user_items,
      shop_invoice_received: pkg.shop_invoice_received,
      remarks: pkg.remarks,
      dangerous_good: pkg.dangerous_good,
      created_by: pkg.created_by
        ? {
            id: pkg.created_by.id,
            email: pkg.created_by.email,
            name: pkg.created_by.name,
          }
        : undefined,
      updated_by: pkg.updated_by
        ? {
            id: pkg.updated_by.id,
            email: pkg.updated_by.email,
            name: pkg.updated_by.name,
          }
        : undefined,
      package_id: pkg.package_id,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at,
      measurements:
        pkg.measurements?.map((measurement) => ({
          id: measurement.id,
          package_id: measurement.packageId,
          piece_number: measurement.piece_number,
          length: measurement.length,
          width: measurement.width,
          height: measurement.height,
          weight: measurement.weight,
          has_measurements: measurement.has_measurements,
          measurement_verified: measurement.measurement_verified,
        })) || [],
      items:
        pkg.items?.map((item) => ({
          id: item.id,
          package_id: item.package_id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })) || [],
    };
  }

  async createPackage(
    createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    const userPreference = await this.userPreferenceRepository.findOne({
      where: { user: { id: createPackageDto.user } },
      relations: ['courier', 'courier.country'],
    });

    if (!userPreference) {
      throw new BadRequestException('User preferences not found');
    }

    const countryId: string = userPreference.courier?.country?.id;

    //Remove the hardcoded country id
    const package_id =
      createPackageDto.package_id ||
      (await this.generateCountryBasedpackage_id(countryId));
    const existingPackage = await this.packageRepository.findOne({
      where: { package_id: package_id },
    });

    if (existingPackage) {
      throw new BadRequestException(`Package ID ${package_id} already exists`);
    }

    const existingTracking = await this.packageRepository.findOne({
      where: { tracking_no: createPackageDto.tracking_no },
    });

    if (existingTracking) {
      throw new BadRequestException(
        `Tracking number ${createPackageDto.tracking_no} already exists`,
      );
    }
    const packageEntity = new Package();
    packageEntity.package_id = package_id;
    packageEntity.user = createPackageDto.user as unknown as User;
    packageEntity.rack_slot_id = createPackageDto.rack_slot;
    packageEntity.tracking_no = createPackageDto.tracking_no;
    packageEntity.vendor_id = createPackageDto.vendor;
    packageEntity.status = createPackageDto.status || 'Action Required';
    // Remove the hardcoded country id
    packageEntity.country = { id: countryId } as Country;
    packageEntity.total_weight = createPackageDto.weight
      ? parseFloat(createPackageDto.weight)
      : null;
    packageEntity.total_volumetric_weight = createPackageDto.volumetric_weight
      ? parseFloat(createPackageDto.volumetric_weight)
      : null;
    packageEntity.dangerous_good = createPackageDto.dangerous_good || false;

    packageEntity.allow_user_items = createPackageDto.allow_user_items || false;
    packageEntity.shop_invoice_received =
      createPackageDto.shop_invoice_received || false;
    packageEntity.remarks = createPackageDto.remarks || null;

    // Ensure created_by is not null
    if (!createPackageDto.created_by) {
      throw new BadRequestException(
        'Authentication required - created_by field is missing',
      );
    }

    // Set the relationship (TypeORM will handle the foreign key)
    packageEntity.created_by = createPackageDto.created_by as unknown as User;

    try {
      const savedPackage = await this.packageRepository.save(packageEntity);

      // Handle pieces array if provided
      if (createPackageDto.pieces && createPackageDto.pieces.length > 0) {
        const measurements: PackageMeasurement[] = [];
        let totalWeight = 0;
        let totalVolumetricWeight = 0;

        for (let i = 0; i < createPackageDto.pieces.length; i++) {
          const piece = createPackageDto.pieces[i];
          const pieceWeight = parseFloat(piece.weight || '0');
          totalWeight += pieceWeight;

          let pieceVolumetricWeight = 0;
          let hasMeasurements = false;

          const length = parseFloat(piece.length || '0');
          const width = parseFloat(piece.width || '0');
          const height = parseFloat(piece.height || '0');

          // Calculate volumetric weight if dimensions are provided
          if (length > 0 && width > 0 && height > 0) {
            // Standard volumetric weight calculation: (L × W × H) / 5000 (for cm to kg)
            pieceVolumetricWeight = (length * width * height) / 5000;
            hasMeasurements = true;
          }

          // Use provided volumetric weight if available, otherwise use calculated
          if (piece.volumetric_weight) {
            pieceVolumetricWeight =
              parseFloat(piece.volumetric_weight) || pieceVolumetricWeight;
          }

          totalVolumetricWeight += pieceVolumetricWeight;

          const measurement = this.packageMeasurementRepository.create({
            packageId: savedPackage.id,
            piece_number: i + 1,
            weight: parseFloat(pieceWeight.toFixed(3)),
            volumetric_weight: parseFloat(pieceVolumetricWeight.toFixed(3)),
            length: length > 0 ? parseFloat(length.toFixed(2)) : undefined,
            width: width > 0 ? parseFloat(width.toFixed(2)) : undefined,
            height: height > 0 ? parseFloat(height.toFixed(2)) : undefined,
            has_measurements: hasMeasurements,
            measurement_verified: false,
          });

          measurements.push(measurement);
        }

        // Save all measurements
        await this.packageMeasurementRepository.save(measurements);

        // Update package with calculated totals
        savedPackage.total_weight = parseFloat(totalWeight.toFixed(3));
        savedPackage.total_volumetric_weight = parseFloat(
          totalVolumetricWeight.toFixed(3)
        );
        await this.packageRepository.save(savedPackage);
      }

      // Load the package with all relations before mapping to response DTO
      const packageWithRelations = await this.packageRepository.findOne({
        where: { id: savedPackage.id },
        relations: ['measurements'],
      });

      if (!packageWithRelations) {
        throw new Error('Failed to load package with relations');
      }

      return this.mapPackageToResponseDto(packageWithRelations);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === '23505'
      ) {
        const dbError = error as { code: string; constraint?: string };

        if (dbError.constraint?.includes('package_id')) {
          throw new BadRequestException(
            `Package ID ${package_id} already exists`,
          );
        } else if (dbError.constraint?.includes('tracking_no')) {
          throw new BadRequestException(
            `Tracking number ${createPackageDto.tracking_no} already exists`,
          );
        }
      }
      throw error;
    }
  }

  async getAllPackages(): Promise<PackageResponseDto[]> {
    const packages = await this.packageRepository.find({
      relations: ['measurements', 'items'],
      order: { created_at: 'DESC' },
    });

    return packages.map((pkg) => this.mapPackageToResponseDto(pkg));
  }

  async getPackagesByUserAndStatus(
    userId: string,
    status: string,
  ): Promise<PackageResponseDto[]> {
    const packages = await this.packageRepository.find({
      where: {
        user: { id: userId },
        status: status,
      },
      relations: ['measurements', 'items', 'user'],
      order: { created_at: 'DESC' },
    });

    return packages.map((pkg) => this.mapPackageToResponseDto(pkg));
  }

  async getPackageById(id: string): Promise<PackageResponseDto> {
    // Check if the input is a UUID format
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id,
      );

    let packageEntity: Package | null;

    if (isUUID) {
      // Search by original ID
      packageEntity = await this.packageRepository.findOne({
        where: { id },
        relations: ['measurements', 'items'],
      });
    } else {
      // Search by package_id or tracking_no
      packageEntity = await this.packageRepository.findOne({
        where: [{ package_id: id }, { tracking_no: id }],
        relations: ['measurements', 'items'],
      });
    }

    if (!packageEntity) {
      throw new NotFoundException(`Package not found with identifier: ${id}`);
    }

    return this.mapPackageToResponseDto(packageEntity);
  }

  async searchPackages(query: string): Promise<PackageResponseDto[]> {
    const packages = await this.packageRepository
      .createQueryBuilder('package')
      .leftJoinAndSelect('package.measurements', 'measurements')
      .leftJoinAndSelect('package.items', 'items')
      .where(
        'package.id = :exactQuery OR package.package_id = :exactQuery OR package.tracking_no ILIKE :likeQuery',
        {
          exactQuery: query,
          likeQuery: `%${query}%`,
        },
      )
      .orderBy('package.created_at', 'DESC')
      .getMany();

    return packages.map((pkg) => this.mapPackageToResponseDto(pkg));
  }

  async updatePackageStatus(
    id: string,
    status: string,
    updated_by: string,
  ): Promise<PackageResponseDto> {
    // Check if the input is a UUID format
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id,
      );

    let packageEntity: Package | null;

    if (isUUID) {
      packageEntity = await this.packageRepository.findOne({ where: { id } });
    } else {
      packageEntity = await this.packageRepository.findOne({
        where: { package_id: id },
      });
    }

    if (!packageEntity) {
      throw new NotFoundException('Package not found');
    }

    // Update the status
    packageEntity.status = status;
    packageEntity.updated_by = updated_by as unknown as User;

    // Generate shipment_id if "Request Ship"
    if (status === 'Request Ship') {
      if (!packageEntity.shipment_id) {
        packageEntity.shipment_id = await this.generateShipmentId();
      }
      if (!packageEntity.shipment_uuid) {
        packageEntity.shipment_uuid = crypto.randomUUID();
      }
    }

    const updatedPackage = await this.packageRepository.save(packageEntity);

    return this.mapPackageToResponseDto(updatedPackage);
  }

  private async generateCountryBasedpackage_id(
    countryId: string,
  ): Promise<string> {
    try {
      // Get country code from country ID
      const country = await this.packageRepository.manager
        .createQueryBuilder()
        .select('countries.code', 'code')
        .from('countries', 'countries')
        .where('countries.id = :countryId', { countryId })
        .getRawOne<{ code: string }>();

      if (!country) {
        throw new BadRequestException('Invalid country ID');
      }

      const countryCode = country.code.substring(0, 3).toUpperCase();

      // Get the next sequence number for this country
      const lastPackage = await this.packageRepository
        .createQueryBuilder('package')
        .where('package.package_id LIKE :pattern', {
          pattern: `${countryCode}-%`,
        })
        .orderBy('package.package_id', 'DESC')
        .getOne();

      let nextNumber = 1;
      if (lastPackage && lastPackage.package_id) {
        const parts = lastPackage.package_id.split('-');
        if (parts.length > 1) {
          const lastNumber = parseInt(parts[1]);
          if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
          }
        }
      }

      // Format: COUNTRY-XXXXXXXX (8 digits with leading zeros)
      const package_id = `${countryCode}-${nextNumber.toString().padStart(8, '0')}`;

      return package_id;
    } catch (error) {
      // Fallback to regular package ID generation if country-based fails
      console.warn(
        'Country-based package ID generation failed, using fallback:',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.message,
      );
      return this.generatepackage_id();
    }
  }

  private async generatepackage_id(): Promise<string> {
    const prefix = 'PKG';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const package_id = `${prefix}${timestamp}${random}`;

    // Check if this custom ID already exists
    const existingPackage = await this.packageRepository.findOne({
      where: { package_id: package_id },
    });

    if (existingPackage) {
      // If exists, generate a new one recursively
      return this.generatepackage_id();
    }

    return package_id;
  }

  // private async generateTrackingNumber(): Promise<string> {
  //   const prefix = 'TRK';
  //   const timestamp = Date.now().toString().slice(-8);
  //   const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  //   return `${prefix}${timestamp}${random}`;
  // }

  async updatePackageInfo(
    id: string,
    dto: UpdatePackageDto,
    updated_by: string,
  ) {
    const pkg = await this.packageRepository.findOne({ where: { id } });
    if (!pkg) throw new NotFoundException('Package not found');
    if (dto.tracking_no) pkg.tracking_no = dto.tracking_no;
    if (dto.weight) pkg.total_weight = parseFloat(dto.weight);
    if (dto.volumetric_weight)
      pkg.total_volumetric_weight = parseFloat(dto.volumetric_weight);
    if (typeof dto.dangerous_good !== 'undefined') {
      pkg.dangerous_good = dto.dangerous_good;
    }
    if (dto.rack_slot) {
      const rack = await this.rackRepository.findOne({
        where: { id: dto.rack_slot },
      });
      if (!rack) throw new NotFoundException('Rack not found');
      pkg.rack_slot = rack;
    }
    const user = await this.userRepository.findOne({
      where: { id: updated_by },
    });
    if (!user) throw new NotFoundException('User not found');
    pkg.updated_by = user;
    return await this.packageRepository.save(pkg);
  }

  private async generateShipmentId(): Promise<string> {
    const prefix = 'SHP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const shipmentId = `${prefix}${timestamp}${random}`;

    const existing = await this.packageRepository.findOne({
      where: { shipment_id: shipmentId },
    });

    if (existing) {
      return this.generateShipmentId();
    }

    return shipmentId;
  }

  async addShipmentDocument(
    shipment_uuid: string,
    dto: {
      url: string;
      original_filename: string;
      document_type?: string;
      file_size?: number;
      mime_type?: string;
    },
    userId: string,
  ) {
    const pkg = await this.packageRepository.findOne({
      where: { shipment_uuid },
    });
    if (!pkg) {
      throw new NotFoundException(
        `----Package not found with shipment_uuid: ${shipment_uuid}`,
      );
    }

    await this.documentsService.create({
      uploaded_by: userId,
      feature_type: FeatureType.Package,
      feature_fid: shipment_uuid,
      document_name: 'Shipment Document',
      original_filename: dto.original_filename,
      document_url: dto.url,
      document_type: dto.document_type || 'photo',
      file_size: dto.file_size,
      mime_type: dto.mime_type,
      category: 'SHIPMENT',
      is_required: false,
    });

    return this.documentsService.findByFeature(
      FeatureType.Package,
      shipment_uuid,
    );
  }

  async getPackagesByShipmentId(
    shipmentId: string,
  ): Promise<PackageResponseDto[]> {
    const packages = await this.packageRepository.find({
      where: { shipment_id: shipmentId },
      relations: [
        'measurements',
        'items',
        'documents',
        'charges',
        'action_logs',
      ],
      order: { created_at: 'DESC' },
    });

    if (!packages || packages.length === 0) {
      throw new NotFoundException(
        `No packages found for shipment_id: ${shipmentId}`,
      );
    }

    return packages.map((pkg) => this.mapPackageToResponseDto(pkg));
  }

  async getPackagesByShipmentUuid(
    shipmentUuid: string,
  ): Promise<PackageResponseDto[]> {
    const packages = await this.packageRepository.find({
      where: { shipment_uuid: shipmentUuid },
      relations: [
        'measurements',
        'items',
        'documents',
        'charges',
        'action_logs',
      ],
      order: { created_at: 'DESC' },
    });

    if (!packages || packages.length === 0) {
      throw new NotFoundException(
        `No packages found for shipment_uuid: ${shipmentUuid}`,
      );
    }

    return packages.map((pkg) => this.mapPackageToResponseDto(pkg));
  }

  async addPaymentSlip(
    shipment_uuid: string,
    dto: {
      url: string;
      original_filename: string;
      document_type?: string;
      file_size?: number;
      mime_type?: string;
    },
    userId: string,
  ): Promise<PackageResponseDto> {
    const pkg = await this.packageRepository.findOne({
      where: { shipment_uuid },
    });

    if (!pkg) {
      throw new NotFoundException(
        `Package not found with shipment_uuid: ${shipment_uuid}`,
      );
    }

    await this.documentsService.create({
      uploaded_by: userId,
      feature_type: FeatureType.Package,
      feature_fid: shipment_uuid,
      document_name: 'Payment Slip',
      original_filename: dto.original_filename,
      document_url: dto.url,
      document_type: dto.document_type || 'slip',
      file_size: dto.file_size,
      mime_type: dto.mime_type,
      category: 'SHIPMENT PAYMENT',
      is_required: false,
    });

    const packageWithRelations = await this.packageRepository.findOne({
      where: { shipment_uuid },
      relations: [
        'measurements',
        'items',
        'documents',
        'charges',
        'action_logs',
      ],
    });

    if (!packageWithRelations) {
      throw new NotFoundException(`Package not found after adding slip`);
    }

    return this.mapPackageToResponseDto(packageWithRelations);
  }

  async findByTrackingNumberAndStatus(
    trackingNumber: string,
    status: string,
  ): Promise<PackageResponseDto> {
    const pkg = await this.packageRepository.findOne({
      where: {
        tracking_no: trackingNumber,
        status: status,
      },
    });

    if (!pkg) {
      throw new NotFoundException(
        `Package with tracking number ${trackingNumber} and status ${status} not found.`,
      );
    }
    return this.mapPackageToResponseDto(pkg);
  }
}
