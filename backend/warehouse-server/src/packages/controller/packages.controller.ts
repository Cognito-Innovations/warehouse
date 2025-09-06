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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PackageResponseDto> {
    return this.packagesService.getPackageById(id);
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
