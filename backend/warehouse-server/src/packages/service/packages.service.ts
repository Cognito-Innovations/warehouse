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


@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageMeasurement)
    private readonly packageMeasurementRepository: Repository<PackageMeasurement>,
  ) {}

  private mapPackageToResponseDto(pkg: Package): PackageResponseDto {
    return {
      id: pkg.id,
      tracking_no: pkg.tracking_no,
      status: pkg.status,
      customer: pkg.customer ? {
        id: pkg.customer.id,
        email: pkg.customer.email,
        name: pkg.customer.name,
        suite_no: pkg.customer.suite_no,
        country: pkg.customer.country,
      } : undefined,
      vendor: pkg.vendor ? {
        id: pkg.vendor.id,
        supplier_name: pkg.vendor.supplier_name,
        country: pkg.vendor.country,
      } : undefined,
      rack_slot: pkg.rack_slot ? {
        id: pkg.rack_slot.id,
        label: pkg.rack_slot.label,
        count: pkg.rack_slot.count,
        color: pkg.rack_slot.color, 
      } : undefined,
      slot_info: pkg.slot_info,
      warehouse_location: pkg.warehouse_location,
      total_weight: pkg.total_weight,
      total_volumetric_weight: pkg.total_volumetric_weight,
      country: pkg.country,
      allow_customer_items: pkg.allow_customer_items,
      shop_invoice_received: pkg.shop_invoice_received,
      remarks: pkg.remarks,
      dangerous_good: pkg.dangerous_good,
      created_by: pkg.creator ? {
        id: pkg.creator.id,
        email: pkg.creator.email,
        name: pkg.creator.name,
      } : undefined,
      updated_by: pkg.updater ? {
        id: pkg.updater.id,
        email: pkg.updater.email,
        name: pkg.updater.name,
      } : undefined,
      package_id: pkg.package_id,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at,
      measurements: pkg.measurements?.map(measurement => ({
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
      items: pkg.items?.map(item => ({
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
    const customer = await this.packageRepository.manager
      .createQueryBuilder()
      .select('country')
      .from('users', 'users')
      .where('id = :customerId', { customerId: createPackageDto.customer })
      .getRawOne();

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    //Remove the hardcoded country id
    const package_id = createPackageDto.package_id || await this.generateCountryBasedpackage_id(customer.country || '54e03123-77f4-477f-85d4-083d4701ae39');
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
      throw new BadRequestException(`Tracking number ${createPackageDto.tracking_no} already exists`);
    }

    // Create the package using TypeORM entity
    const packageEntity = new Package();
    packageEntity.package_id = package_id;
    packageEntity.customer_id = createPackageDto.customer;
    packageEntity.rack_slot_id = createPackageDto.rack_slot;
    packageEntity.tracking_no = createPackageDto.tracking_no;
    packageEntity.vendor_id = createPackageDto.vendor;
    packageEntity.status = createPackageDto.status || 'Action Required';
    // Remove the hardcoded country id
    packageEntity.country = customer.country || '54e03123-77f4-477f-85d4-083d4701ae39'; // Use country from user profile, default to India
    packageEntity.total_weight = createPackageDto.weight ? parseFloat(createPackageDto.weight) : null;
    packageEntity.total_volumetric_weight = createPackageDto.volumetric_weight ? parseFloat(createPackageDto.volumetric_weight) : null;
    packageEntity.dangerous_good = createPackageDto.dangerous_good || false;
    packageEntity.allow_customer_items = createPackageDto.allow_customer_items || false;
    packageEntity.shop_invoice_received = createPackageDto.shop_invoice_received || false;
    packageEntity.remarks = createPackageDto.remarks || null;
    
    // Ensure created_by is not null
    if (!createPackageDto.created_by) {
      throw new BadRequestException('Authentication required - created_by field is missing');
    }
    
    // Set the relationship (TypeORM will handle the foreign key)
    packageEntity.creator = { id: createPackageDto.created_by } as any;
    
    try {
      const savedPackage = await this.packageRepository.save(packageEntity);
      console.log("Saved Pkg: ",savedPackage);
      
      // Handle pieces array if provided
      if (createPackageDto.pieces && createPackageDto.pieces.length > 0) {
        const measurements: PackageMeasurement[] = [];
        let totalWeight = 0;
        let totalVolumetricWeight = 0;
        
        for (let i = 0; i < createPackageDto.pieces.length; i++) {
          const piece = createPackageDto.pieces[i];
          const pieceWeight = parseFloat(piece.weight) || 0;
          totalWeight += pieceWeight;
          
          let pieceVolumetricWeight = 0;
          let hasMeasurements = false;
          
          // Calculate volumetric weight if dimensions are provided
          if (piece.length && piece.width && piece.height) {
            const length = parseFloat(piece.length) || 0;
            const width = parseFloat(piece.width) || 0;
            const height = parseFloat(piece.height) || 0;
            
            if (length > 0 && width > 0 && height > 0) {
              // Standard volumetric weight calculation: (L × W × H) / 5000 (for cm to kg)
              pieceVolumetricWeight = (length * width * height) / 5000;
              hasMeasurements = true;
            }
          }
          
          // Use provided volumetric weight if available, otherwise use calculated
          if (piece.volumetric_weight) {
            pieceVolumetricWeight = parseFloat(piece.volumetric_weight) || pieceVolumetricWeight;
          }
          
          totalVolumetricWeight += pieceVolumetricWeight;
          
          const measurement = this.packageMeasurementRepository.create({
            packageId: savedPackage.id,
            piece_number: i + 1,
            weight: pieceWeight,
            volumetric_weight: pieceVolumetricWeight,
            length: piece.length ? parseFloat(piece.length) : undefined,
            width: piece.width ? parseFloat(piece.width) : undefined,
            height: piece.height ? parseFloat(piece.height) : undefined,
            has_measurements: hasMeasurements,
            measurement_verified: false,
          });
          
          measurements.push(measurement);
        }
        
        // Save all measurements
        await this.packageMeasurementRepository.save(measurements);
        
        // Update package with calculated totals
        savedPackage.total_weight = totalWeight;
        savedPackage.total_volumetric_weight = totalVolumetricWeight;
        await this.packageRepository.save(savedPackage);
      }
      console.log("After save: ",savedPackage);
      
      // Load the package with all relations before mapping to response DTO
      const packageWithRelations = await this.packageRepository.findOne({
        where: { id: savedPackage.id },
        relations: ['measurements']
      });
      
      if (!packageWithRelations) {
        throw new Error('Failed to load package with relations');
      }
      
      return this.mapPackageToResponseDto(packageWithRelations);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        if (error.constraint?.includes('package_id')) {
          throw new BadRequestException(`Package ID ${package_id} already exists`);
        } else if (error.constraint?.includes('tracking_no')) {
          throw new BadRequestException(`Tracking number ${createPackageDto.tracking_no} already exists`);
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

  async getPackagesByUserAndStatus(userId: string, status: string): Promise<PackageResponseDto[]> {
    console.log('getPackagesByUserAndStatus called with:', { userId, status });
    
    const packages = await this.packageRepository.find({
      where: {
        customer_id: userId,
        status: status,
      },
      relations: ['measurements', 'items', 'customer'],
      order: { created_at: 'DESC' },
    });

    console.log('Found packages:', packages.length);
    console.log('Package details:', packages.map(pkg => ({ id: pkg.id, tracking_no: pkg.tracking_no, status: pkg.status, customer_id: pkg.customer_id, customer_name: pkg.customer?.name })));

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
        relations: ['measurements', 'items']
      });
    } else {
      // Search by package_id or tracking_no
      packageEntity = await this.packageRepository.findOne({
        where: [
          { package_id: id },
          { tracking_no: id }
        ],
        relations: ['measurements', 'items']
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
          likeQuery: `%${query}%`
        }
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
    console.log('updatePackageStatus called with:', { id, status, updated_by });
    
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

    console.log('Found package:', { id: packageEntity.id, current_status: packageEntity.status });

    // Update the status
    packageEntity.status = status;
    packageEntity.updated_by = updated_by;
    
    console.log('Updating package with:', { new_status: status, updated_by });
    
    const updatedPackage = await this.packageRepository.save(packageEntity);
    
    console.log('Package updated successfully:', { id: updatedPackage.id, new_status: updatedPackage.status });

    return this.mapPackageToResponseDto(updatedPackage);
  }

  private async generateCountryBasedpackage_id(countryId: string): Promise<string> {
    try {
      // Get country code from country ID
      const country = await this.packageRepository.manager
        .createQueryBuilder()
        .select('country')
        .from('countries', 'countries')
        .where('id = :countryId', { countryId })
        .getRawOne();

      if (!country) {
        throw new BadRequestException('Invalid country ID');
      }

      // Extract country code (first 3 characters, uppercase)
      const countryCode = country.country.substring(0, 3).toUpperCase();
      
      // Get the next sequence number for this country
      const lastPackage = await this.packageRepository
        .createQueryBuilder('package')
        .where('package.package_id LIKE :pattern', { pattern: `${countryCode}-%` })
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
      console.warn('Country-based package ID generation failed, using fallback:', error.message);
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

  private async generateTrackingNumber(): Promise<string> {
    const prefix = 'TRK';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}
