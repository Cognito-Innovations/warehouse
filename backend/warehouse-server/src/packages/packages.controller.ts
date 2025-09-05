import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { PackageResponseDto } from './dto/package-response.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  async create(
    @Body() createPackageDto: CreatePackageDto,
  ): Promise<PackageResponseDto> {
    return this.packagesService.createPackage(createPackageDto);
  }

  @Get()
  async findAll(): Promise<PackageResponseDto[]> {
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
