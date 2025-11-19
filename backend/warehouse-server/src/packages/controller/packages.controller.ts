import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Query,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

import { PackagesService } from '../service/packages.service';
import { CreatePackageDto } from '../dto/create-package.dto';
import { PackageResponseDto } from '../dto/package-response.dto';
import { UpdatePackageDto } from '../dto/update-package.dto';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';
import { CreatePackageChargeDto } from '../dto/create-package-charge.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
  };
}

@ApiTags('Packages')
@Controller('packages')
@UseGuards(JwtAuthGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new package' })
  @ApiCreatedResponse({
    description: 'Package created successfully',
    type: PackageResponseDto,
  })
  @ApiBody({
    type: CreatePackageDto,
    examples: {
      Basic: {
        summary: 'Basic package',
        value: {
          user: '123e4567-e89b-12d3-a456-426614174000',
          rack_slot: 'A1',
          vendor: 'Amazon',
          tracking_no: 'TRACK123456',
          status: 'IN_WAREHOUSE',
          remarks: 'Fragile items',
          pieces: [{ weight: '5kg', length: '30', width: '20', height: '10' }],
        },
      },
    },
  })
  async create(
    @Body() createPackageDto: CreatePackageDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<PackageResponseDto> {
    // Get the authenticated user's ID from the JWT token
    createPackageDto.created_by = req.user.id;
    return this.packagesService.createPackage(createPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packages or search' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by tracking number or vendor',
    example: 'TRACK123456',
  })
  @ApiOkResponse({ type: [PackageResponseDto] })
  async findAll(
    @Query('search') search?: string,
  ): Promise<PackageResponseDto[]> {
    if (search) {
      return this.packagesService.searchPackages(search);
    }
    return this.packagesService.getAllPackages();
  }

  @Get('debug/all')
  async debugAllPackages(): Promise<any[]> {
    const packages = await this.packagesService.getAllPackages();
    return packages.map((pkg) => ({
      id: pkg.id,
      tracking_no: pkg.tracking_no,
      status: pkg.status,
      user_id: pkg.user?.id,
      created_at: pkg.created_at,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get package by ID' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({ type: PackageResponseDto })
  async findOne(@Param('id') id: string): Promise<PackageResponseDto> {
    return this.packagesService.getPackageById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all packages for a user' })
  @ApiParam({ name: 'userId', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({ type: [PackageResponseDto] })
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<PackageResponseDto[]> {
    return this.packagesService.getPackagesByUser(userId);
  }

  @Get('user/:userId/status/:status')
  @ApiOperation({ summary: 'Get packages by user and status' })
  @ApiParam({ name: 'userId', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiParam({ name: 'status', example: 'IN_TRANSIT' })
  @ApiOkResponse({ type: [PackageResponseDto] })
  async findByUserAndStatus(
    @Param('userId') userId: string,
    @Param('status') status: string,
  ): Promise<PackageResponseDto[]> {
    const result = await this.packagesService.getPackagesByUserAndStatus(
      userId,
      status,
    );
    return result;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update package status' })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'DELIVERED' },
        updated_by: { type: 'string', example: 'admin-user-id' },
      },
      required: ['status', 'updated_by'],
    },
  })
  @ApiOkResponse({ type: PackageResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; updated_by: string },
  ): Promise<PackageResponseDto> {
    return this.packagesService.updatePackageStatus(
      id,
      body.status,
      body.updated_by,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Update package details (tracking, weight, volumetric, dangerous good, rack_slot)',
  })
  @ApiOkResponse({ type: PackageResponseDto })
  async updatePackage(
    @Param('id') id: string,
    @Body() dto: UpdatePackageDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.packagesService.updatePackageInfo(id, dto, req.user.id);
  }

  @Post('shipments/:package_uuid/documents')
  @ApiOperation({ summary: 'Upload shipment document/photo' })
  async uploadShipmentDocument(
    @Param('package_uuid') package_uuid: string,
    @Body()
    body: {
      url: string;
      original_filename: string;
      document_type?: string;
      file_size?: number;
      mime_type?: string;
    },
    @Request() req: AuthenticatedRequest,
  ) {
    return this.packagesService.addShipmentDocument(
      package_uuid,
      body,
      req.user.id,
    );
  }

  @Get('shipments/:package_uuid/documents')
  @ApiOperation({ summary: 'Get all documents/photos for a shipment' })
  async getShipmentDocuments(@Param('package_uuid') package_uuid: string) {
    return this.packagesService['documentsService'].findByFeature(
      FeatureType.Package,
      package_uuid,
      'PACKAGE',
    );
  }

  @Get('shipments/id/:shipment_id')
  @ApiOperation({ summary: 'Get all packages by shipment_id' })
  async findByShipmentId(@Param('shipment_id') shipmentId: string) {
    return this.packagesService.getPackagesByShipmentId(shipmentId);
  }

  @Get('shipments/:shipment_uuid/slips')
  @ApiOperation({ summary: 'Get all payment slips for a shipment' })
  async getPaymentSlips(@Param('shipment_uuid') shipment_uuid: string) {
    return this.packagesService['documentsService'].findByFeature(
      FeatureType.Package,
      shipment_uuid,
      'SHIPMENT PAYMENT',
    );
  }

  @Post('shipments/charges')
  @ApiOperation({ summary: 'Create a package shipment charge' })
  @ApiBody({ type: CreatePackageChargeDto })
  async createPackageCharge(
    @Body() createPackageChargeDto: CreatePackageChargeDto,
  ): Promise<any> {
    return this.packagesService.createPackageCharges(createPackageChargeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a package by ID' })
  @ApiParam({ name: 'id', description: 'The UUID of the package' })
  @ApiOkResponse({ description: 'Package deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.packagesService.deletePackage(id);
  }
}
