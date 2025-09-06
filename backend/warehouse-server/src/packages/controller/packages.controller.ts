import { Body, Controller, Get, Post, Param, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { PackagesService } from '../service/packages.service';
import { CreatePackageDto } from '../dto/create-package.dto';
import { PackageResponseDto } from '../dto/package-response.dto';

@Controller('packages')
@UseGuards(JwtAuthGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  async create(
    @Body() createPackageDto: CreatePackageDto,
    @Request() req,
  ): Promise<PackageResponseDto> {
    // Get the authenticated user's ID from the JWT token
    createPackageDto.created_by = req.user.id;
    return this.packagesService.createPackage(createPackageDto);
  }

  @Get()
  async findAll(@Query('search') search?: string): Promise<PackageResponseDto[]> {
    if (search) {
      return this.packagesService.searchPackages(search);
    }
    return this.packagesService.getAllPackages();
  }

  @Get('debug/all')
  async debugAllPackages(): Promise<any[]> {
    console.log('Debug: Getting all packages');
    const packages = await this.packagesService.getAllPackages();
    console.log('Debug: Found', packages.length, 'total packages');
    return packages.map(pkg => ({
      id: pkg.id,
      tracking_no: pkg.tracking_no,
      status: pkg.status,
      customer_id: pkg.customer?.id,
      created_at: pkg.created_at
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PackageResponseDto> {
    return this.packagesService.getPackageById(id);
  }

  @Get('user/:userId/status/:status')
  async findByUserAndStatus(
    @Param('userId') userId: string,
    @Param('status') status: string,
  ): Promise<PackageResponseDto[]> {
    console.log('PackagesController: findByUserAndStatus called with:', { userId, status });
    const result = await this.packagesService.getPackagesByUserAndStatus(userId, status);
    console.log('PackagesController: returning', result.length, 'packages');
    return result;
  }

  @Patch(':id/status')
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
}
