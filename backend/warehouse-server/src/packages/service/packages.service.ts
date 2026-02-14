import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  ILike,
  IsNull,
  Repository,
} from 'typeorm';
import { isUUID } from 'class-validator';

import { CreatePackageDto, PackagePieceDto } from '../dto/create-package.dto';
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
import { PackageSequence } from '../entities/package-sequence.entity';
import { UserContextService } from 'src/shared/user-context.service';

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
    private readonly dataSource: DataSource,
    private readonly userContextService: UserContextService,
  ) {}

  async getPackagesCount(countryId?: string): Promise<number> {
    const where: FindOptionsWhere<Package> = {};

    if (countryId) {
      where.country = { id: countryId };
    }

    return this.packageRepository.count({ where });
  }

  async getActionRequiredPackagesCount(countryId?: string): Promise<number> {
    const where: FindOptionsWhere<Package> = {
      status: 'Action Required',
    };

    if (countryId) {
      where.country = { id: countryId };
    }

    return this.packageRepository.count({ where });
  }

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
      discard_comment,
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
          ...item,
        })) || [],
      discard_comment,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const package_id =
        createPackageDto.package_id ||
        (await this.generateCountryBasedpackage_id(
          countryId,
          queryRunner.manager,
        ));

      await this.ensurePackageAndTrackingUnique(
        package_id,
        createPackageDto.tracking_no,
        queryRunner.manager,
      );

      const packageEntity = this.preparePackageEntity(
        createPackageDto,
        package_id,
        countryId,
      );

      const savedPackage = await queryRunner.manager.save(packageEntity);

      await this.updateRackSlot(
        createPackageDto.rack_slot,
        queryRunner.manager,
      );

      await this.handlePackageMeasurements(
        savedPackage,
        createPackageDto.pieces || [],
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

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
      await queryRunner.rollbackTransaction();
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === '23505'
      ) {
        const dbError = error as { code: string; constraint?: string };

        if (dbError.constraint?.includes('package_id')) {
          throw new BadRequestException(
            `Package ID ${createPackageDto.package_id || 'generated'} already exists`,
          );
        } else if (dbError.constraint?.includes('tracking_no')) {
          throw new BadRequestException(
            `Tracking number ${createPackageDto.tracking_no} already exists`,
          );
        }
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async ensurePackageAndTrackingUnique(
    package_id: string,
    tracking_no: string,
    manager: EntityManager,
  ) {
    const existingPackage = await manager.findOne(Package, {
      where: { package_id },
    });
    if (existingPackage) {
      throw new BadRequestException(`Package ID ${package_id} already exists`);
    }

    const existingTracking = await manager.findOne(Package, {
      where: { tracking_no },
    });
    if (existingTracking) {
      throw new BadRequestException(
        `Tracking number ${tracking_no} already exists`,
      );
    }
  }

  private preparePackageEntity(
    createPackageDto: CreatePackageDto,
    package_id: string,
    countryId: string,
  ): Package {
    if (!createPackageDto.created_by) {
      throw new BadRequestException(
        'Authentication required - created_by field is missing',
      );
    }

    const packageEntity = new Package();
    packageEntity.package_id = package_id;
    packageEntity.user = createPackageDto.user as unknown as User;
    packageEntity.rack_slot_id = createPackageDto.rack_slot;
    packageEntity.tracking_no = createPackageDto.tracking_no;
    packageEntity.vendor_id = createPackageDto.vendor;
    packageEntity.status = createPackageDto.status || 'Action Required';
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
    packageEntity.created_by = createPackageDto.created_by as unknown as User;

    return packageEntity;
  }

  private async updateRackSlot(
    rack_slot_id: string | undefined,
    manager: EntityManager,
  ) {
    if (!rack_slot_id) return;
    const rack = await manager.findOne(Rack, {
      where: { id: rack_slot_id },
    });
    if (rack) {
      rack.count = (rack.count || 0) + 1;
      await manager.save(rack);
    }
  }

  private async handlePackageMeasurements(
    savedPackage: Package,
    pieces: PackagePieceDto[],
    manager: EntityManager,
  ): Promise<void> {
    if (!pieces || pieces.length === 0) return;

    const measurements: PackageMeasurement[] = [];
    let totalWeight = 0;
    let totalVolumetricWeight = 0;

    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const hasPartialDimensions =
        (piece.length || piece.width || piece.height) &&
        !(piece.length && piece.width && piece.height);
      if (hasPartialDimensions) {
        throw new BadRequestException(
          `For piece ${i + 1}, if any dimension (length, width, height) is provided, all three are required.`,
        );
      }

      const weight = parseFloat(piece.weight || '0');
      totalWeight += weight;

      let volumetricWeight = 0;
      const length = parseFloat(piece.length || '0');
      const width = parseFloat(piece.width || '0');
      const height = parseFloat(piece.height || '0');

      if (length > 0 && width > 0 && height > 0) {
        volumetricWeight = (length * width * height) / 5000;
      }

      if (piece.volumetric_weight) {
        volumetricWeight =
          parseFloat(piece.volumetric_weight) || volumetricWeight;
      }

      totalVolumetricWeight += volumetricWeight;

      const measurement = manager.create(PackageMeasurement, {
        packageId: savedPackage.id,
        piece_number: i + 1,
        weight: parseFloat(weight.toFixed(3)),
        volumetric_weight: parseFloat(volumetricWeight.toFixed(3)),
        length: length > 0 ? parseFloat(length.toFixed(2)) : undefined,
        width: width > 0 ? parseFloat(width.toFixed(2)) : undefined,
        height: height > 0 ? parseFloat(height.toFixed(2)) : undefined,
        has_measurements: length > 0 && width > 0 && height > 0,
        measurement_verified: false,
      });

      measurements.push(measurement);
    }

    await manager.save(measurements);

    savedPackage.total_weight = parseFloat(totalWeight.toFixed(3));
    savedPackage.total_volumetric_weight = parseFloat(
      totalVolumetricWeight.toFixed(3),
    );
    await manager.save(savedPackage);
  }

  async getAllPackages(userId?: string): Promise<PackageResponseDto[]> {
    const where: FindOptionsWhere<Package> = {};

    let countryId: string | null = null;

    if (userId) {
      countryId =
        await this.userContextService.getUserPreferredCountryId(userId);
    }

    if (countryId) {
      where.country = { id: countryId };
    }

    const packages = await this.packageRepository.find({
      where: where,
      relations: ['measurements', 'items', 'user', 'country'],
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

  async searchPackages(
    searchTerm: string,
    userId?: string,
  ): Promise<PackageResponseDto[]> {
    const whereConditions: FindOptionsWhere<Package>[] = [
      { package_id: searchTerm },
      { tracking_no: ILike(`%${searchTerm}%`) },
    ];

    if (isUUID(searchTerm)) {
      whereConditions.push({ id: searchTerm });
    }

    let countryId: string | null = null;

    if (userId) {
      countryId =
        await this.userContextService.getUserPreferredCountryId(userId);
    }

    if (countryId) {
      whereConditions.forEach((condition) => {
        condition.country = { id: countryId };
      });
    }

    const packages = await this.packageRepository.find({
      where: whereConditions,
      relations: ['measurements', 'items', 'user', 'country'],
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
    updated_by_id: string,
    discard_comment?: string,
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
    if (discard_comment && status === 'Discarded') {
      packageEntity.discard_comment = discard_comment;
    }
    packageEntity.updated_by = { id: updated_by_id } as User;

    const updatedPackage = await this.packageRepository.save(packageEntity);

    return this.mapPackageToResponseDto(updatedPackage);
  }

  private async generateCountryBasedpackage_id(
    countryId: string,
    manager: EntityManager,
  ): Promise<string> {
    const year = new Date().getFullYear();

    const country = await manager.findOne(Country, {
      where: { id: countryId },
      select: { code: true },
    });

    if (!country) {
      throw new BadRequestException('Invalid country ID');
    }

    const countryCode = country.code.substring(0, 3).toUpperCase();

    let sequence = await manager.findOne(PackageSequence, {
      where: { country_code: countryCode, year },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sequence) {
      try {
        const newSequence = manager.create(PackageSequence, {
          country_code: countryCode,
          year,
          last_value: 0,
        });
        sequence = await manager.save(newSequence);
      } catch (error) {
        console.error('Error creating package sequence, retrying...', error);
        sequence = await manager.findOne(PackageSequence, {
          where: { country_code: countryCode, year },
          lock: { mode: 'pessimistic_write' },
        });

        if (!sequence) {
          throw new Error(
            `Failed to generate package sequence for ${countryCode}-${year}`,
          );
        }
      }
    }

    sequence.last_value += 1;
    await manager.save(sequence);

    const padded = String(sequence.last_value).padStart(4, '0');

    return `${countryCode}${year}${padded}`;
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
