import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { CreatePackageDto } from '../dto/create-package.dto';
import { PackageResponseDto } from '../dto/package-response.dto';
import { UpdatePackageDto } from '../dto/update-package.dto';
import { CreatePackageChargeDto } from '../dto/create-package-charge.dto';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';

import { Package, PackageCharge, PackageMeasurement } from '../entities';
import { User } from 'src/users/user.entity';
import { Country } from 'src/Countries/country.entity';
import { UserPreference } from 'src/user-preferences/user-preference.entity';
import { Rack } from 'src/racks/rack.entity';
import { DocumentsService } from 'src/documents/documents.service';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly userPreferencesService: UserPreferencesService,
    @InjectRepository(PackageMeasurement)
    private readonly packageMeasurementRepository: Repository<PackageMeasurement>,
    @InjectRepository(Rack)
    private readonly rackRepository: Repository<Rack>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>,
    private readonly documentsService: DocumentsService,
    @InjectRepository(PackageCharge)
    private readonly packageChargeRepository: Repository<PackageCharge>,
  ) {}

  private async mapPackageToResponseDto(
    pkg: Package,
  ): Promise<PackageResponseDto> {
    const {
      status,
      user,
      vendor,
      rack_slot,
      documents,
      created_by,
      updated_by,
      measurements,
      items,
      charges: pkgCharges,
      ...restOfPkg
    } = pkg;

    const charges = await Promise.all(
      pkgCharges?.map(async (charge) => ({
        ...charge,
        amount: await this.userPreferencesService.getFormattedConvertedPrice(
          user.id,
          charge.amount,
        ),
      })) || [],
    );

    return {
      ...restOfPkg,
      status: {
        label: status,
        value: status,
      },
      user: user 
        ? (({ alternate_phone_number, ...restOfUser }) => ({
            ...restOfUser,
            phone_number_2: alternate_phone_number,
          }))(user)
        : undefined,
      vendor: vendor
        ? {
            ...vendor,
            country: vendor.country?.name,
          }
        : undefined,
      charges: charges,
      rack_slot: rack_slot || undefined,
      documents:
        documents?.map((doc) => ({
          id: doc.id,
          document_name: doc.document_name,
          document_url: doc.document_url,
          category: doc.category,
        })) || [],
      created_by: created_by
        ? {
            id: created_by.id,
            email: created_by.email,
            name: created_by.name,
          }
        : undefined,
      updated_by: updated_by
        ? {
            id: updated_by.id,
            email: updated_by.email,
            name: updated_by.name,
          }
        : undefined,
      measurements:
        measurements?.map((measurement) => ({
          ...measurement,
          package_id: measurement.packageId,
        })) || [],
      items:
        items?.map((item) => ({
          ...item
        })) || [],
    }
  }

  //TODO: Need to improve this function
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

      if (createPackageDto.rack_slot) {
        const rack = await this.rackRepository.findOne({
          where: { id: createPackageDto.rack_slot },
        });

        if (rack) {
          rack.count = (rack.count || 0) + 1;
          await this.rackRepository.save(rack);
        }
      }

      // Handle pieces array if provided
      if (createPackageDto.pieces && createPackageDto.pieces.length > 0) {
        const measurements: PackageMeasurement[] = [];
        let totalWeight = 0;
        let totalVolumetricWeight = 0;

        for (let i = 0; i < createPackageDto.pieces.length; i++) {
          const piece = createPackageDto.pieces[i];

          const hasPartialDimensions =
            (piece.length || piece.width || piece.height) &&
            !(piece.length && piece.width && piece.height);

          if (hasPartialDimensions) {
            throw new BadRequestException(
              `For piece ${i + 1}, if any dimension (length, width, height) is provided, all three are required.`,
            );
          }

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
          totalVolumetricWeight.toFixed(3),
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
      relations: ['measurements', 'items', 'user'],
      order: { created_at: 'DESC' },
    });

    const results = await Promise.allSettled(
      packages.map((pkg) => this.mapPackageToResponseDto(pkg)),
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<PackageResponseDto> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);
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

    return Promise.all(
      packages.map((pkg) => this.mapPackageToResponseDto(pkg)),
    );
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
        relations: [
          'measurements',
          'items',
          'user',
          'user.preference',
          'user.address',
          'charges',
        ],
      });
    } else {
      // Search by package_id or tracking_no
      packageEntity = await this.packageRepository.findOne({
        where: [{ package_id: id }, { tracking_no: id }],
        relations: [
          'measurements',
          'items',
          'user',
          'user.preference',
          'user.address',
          'charges',
        ],
      });
    }

    if (!packageEntity) {
      throw new NotFoundException(`Package not found with identifier: ${id}`);
    }
    return this.mapPackageToResponseDto(packageEntity);
  }

  async searchPackages(searchTerm: string): Promise<PackageResponseDto[]> {
    const whereConditions: FindOptionsWhere<Package>[] = [
      { package_id: searchTerm },
      { tracking_no: ILike(`%${searchTerm}%`) },
    ];

    if (isUUID(searchTerm)) {
      whereConditions.push({ id: searchTerm });
    }

    const packages = await this.packageRepository.find({
      where: whereConditions,
      relations: ['measurements', 'items', 'user'],
      order: { created_at: 'DESC' },
    });

    return Promise.all(
      packages.map((pkg) => this.mapPackageToResponseDto(pkg)),
    );
  }

  async getPackagesByUser(userId: string): Promise<PackageResponseDto[]> {
    const packages = await this.packageRepository.find({
      where: {
        user: { id: userId },
        shipment_id: IsNull(),
      },
      relations: [
        'measurements',
        'items',
        'user',
        'user.preference',
        'user.address',
        'documents',
      ],
      order: { created_at: 'DESC' },
    });

    return Promise.all(
      packages.map((pkg) => this.mapPackageToResponseDto(pkg)),
    );
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

  //TODO: Need to improve this function
  async updatePackageInfo(
    id: string,
    dto: UpdatePackageDto,
    updated_by: string,
  ) {
    const pkg = await this.packageRepository.findOne({
      where: { id },
      relations: ['rack_slot'],
    });
    if (!pkg) throw new NotFoundException('Package not found');

    const oldRack = pkg.rack_slot;

    if (typeof dto.tracking_no !== 'undefined') {
      pkg.tracking_no = dto.tracking_no;
    }
    if (typeof dto.weight !== 'undefined') {
      pkg.total_weight = parseFloat(dto.weight);
    }
    if (typeof dto.volumetric_weight !== 'undefined') {
      pkg.total_volumetric_weight = parseFloat(dto.volumetric_weight);
    }
    if (typeof dto.dangerous_good !== 'undefined') {
      pkg.dangerous_good = dto.dangerous_good;
    }
    if (
      typeof dto.rack_slot !== 'undefined' &&
      dto.rack_slot !== (oldRack?.id || null)
    ) {
      if (oldRack) {
        oldRack.count = Math.max(0, oldRack.count - 1);
        await this.rackRepository.save(oldRack);
      }

      if (dto.rack_slot === null || dto.rack_slot === '') {
        pkg.rack_slot = null;
      } else {
        const newRack = await this.rackRepository.findOne({
          where: { id: dto.rack_slot },
        });
        if (!newRack) throw new NotFoundException('New Rack not found');
        newRack.count += 1;
        await this.rackRepository.save(newRack);

        pkg.rack_slot = newRack;
      }
    }

    const user = await this.userRepository.findOne({
      where: { id: updated_by },
    });
    if (!user) throw new NotFoundException('User not found');
    pkg.updated_by = user;

    return await this.packageRepository.save(pkg);
  }

  async addShipmentDocument(
    package_uuid: string,
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
      where: { id: package_uuid },
    });
    if (!pkg) {
      throw new NotFoundException(
        `Package not found with package_uuid: ${package_uuid}`,
      );
    }

    await this.documentsService.create({
      uploaded_by: userId,
      feature_type: FeatureType.Package,
      feature_fid: package_uuid,
      document_name: 'Package Document',
      original_filename: dto.original_filename,
      document_url: dto.url,
      document_type: dto.document_type || 'photo',
      file_size: dto.file_size,
      mime_type: dto.mime_type,
      category: 'PACKAGE',
      is_required: false,
    });

    return this.documentsService.findByFeature(
      FeatureType.Package,
      package_uuid,
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

    return Promise.all(
      packages.map((pkg) => this.mapPackageToResponseDto(pkg)),
    );
  }

  async createPackageCharges(createPackageChargeDto: CreatePackageChargeDto) {
    const packageCharge = this.packageChargeRepository.create({
      ...createPackageChargeDto,
      package: { id: createPackageChargeDto.package_id },
    });
    return await this.packageChargeRepository.save(packageCharge);
  }

  async deletePackage(id: string): Promise<void> {
    const packageEntity = await this.packageRepository.findOne({
      where: { id },
    });

    if (!packageEntity) {
      throw new NotFoundException(`Package with ID "${id}" not found`);
    }

    await this.packageRepository.remove(packageEntity);
  }
}
