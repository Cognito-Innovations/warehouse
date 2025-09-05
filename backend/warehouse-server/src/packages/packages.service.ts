import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { PackageResponseDto } from './dto/package-response.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async createPackage(createPackageDto: CreatePackageDto): Promise<PackageResponseDto> {
    // Generate custom package ID (will be stored in a separate field)
    const customPackageId = await this.generatePackageId();
    
    // Create the package using TypeORM entity
    const packageEntity = this.packageRepository.create({
      customer: createPackageDto.customer,
      rack_slot: createPackageDto.rack_slot,
      vendor: createPackageDto.vendor,
      status: createPackageDto.status || 'Action Required',
      dangerous_good: createPackageDto.dangerous_good || false,
      created_by: createPackageDto.created_by,
      custom_package_id: customPackageId,
    });

    const savedPackage = await this.packageRepository.save(packageEntity);

    return {
      id: savedPackage.id,
      customer: savedPackage.customer,
      rack_slot: savedPackage.rack_slot,
      vendor: savedPackage.vendor,
      status: savedPackage.status,
      dangerous_good: savedPackage.dangerous_good,
      created_by: savedPackage.created_by,
      custom_package_id: savedPackage.custom_package_id,
      created_at: savedPackage.created_at,
      updated_at: savedPackage.updated_at,
    };
  }

  async getAllPackages(): Promise<PackageResponseDto[]> {
    const packages = await this.packageRepository.find({
      order: { created_at: 'DESC' },
    });
    
    return packages.map(pkg => ({
      id: pkg.id,
      customer: pkg.customer,
      rack_slot: pkg.rack_slot,
      vendor: pkg.vendor,
      status: pkg.status,
      dangerous_good: pkg.dangerous_good,
      created_by: pkg.created_by,
      custom_package_id: pkg.custom_package_id,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at,
    }));
  }

  async getPackageById(id: string): Promise<PackageResponseDto> {
    // Check if the input is a UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    let packageEntity: Package | null;
    
    if (isUUID) {
      packageEntity = await this.packageRepository.findOne({ where: { id } });
    } else {
      packageEntity = await this.packageRepository.findOne({ where: { custom_package_id: id } });
    }

    if (!packageEntity) {
      throw new NotFoundException('Package not found');
    }

    return {
      id: packageEntity.id,
      customer: packageEntity.customer,
      rack_slot: packageEntity.rack_slot,
      vendor: packageEntity.vendor,
      status: packageEntity.status,
      dangerous_good: packageEntity.dangerous_good,
      created_by: packageEntity.created_by,
      custom_package_id: packageEntity.custom_package_id,
      created_at: packageEntity.created_at,
      updated_at: packageEntity.updated_at,
    };
  }

  async updatePackageStatus(id: string, status: string, updated_by: string): Promise<PackageResponseDto> {
    // Check if the input is a UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    let packageEntity: Package | null;
    
    if (isUUID) {
      packageEntity = await this.packageRepository.findOne({ where: { id } });
    } else {
      packageEntity = await this.packageRepository.findOne({ where: { custom_package_id: id } });
    }

    if (!packageEntity) {
      throw new NotFoundException('Package not found');
    }

    // Update the status
    packageEntity.status = status;
    const updatedPackage = await this.packageRepository.save(packageEntity);

    return {
      id: updatedPackage.id,
      customer: updatedPackage.customer,
      rack_slot: updatedPackage.rack_slot,
      vendor: updatedPackage.vendor,
      status: updatedPackage.status,
      dangerous_good: updatedPackage.dangerous_good,
      created_by: updatedPackage.created_by,
      custom_package_id: updatedPackage.custom_package_id,
      created_at: updatedPackage.created_at,
      updated_at: updatedPackage.updated_at,
    };
  }

  private async generatePackageId(): Promise<string> {
    const prefix = 'PKG';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const packageId = `${prefix}${timestamp}${random}`;
    
    // Check if this custom ID already exists
    const existingPackage = await this.packageRepository.findOne({
      where: { custom_package_id: packageId }
    });
    
    if (existingPackage) {
      // If exists, generate a new one recursively
      return this.generatePackageId();
    }
    
    return packageId;
  }

  private async generateTrackingNumber(): Promise<string> {
    const prefix = 'TRK';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}