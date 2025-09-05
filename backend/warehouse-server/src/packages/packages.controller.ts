import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { PackagesService } from './packages.service';

interface CreatePackageDto {
  customer: string;
  rack_slot: string;
  tracking_no?: string;
  vendor: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  volumetric_weight: string;
  allow_customer_items: boolean;
  shop_invoice_received: boolean;
  remarks: string;
  pieces: Array<{
    weight: string;
    length: string;
    width: string;
    height: string;
    volumetric_weight: string;
  }>;
}

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  async create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.createPackage(createPackageDto);
  }

  @Get()
  async findAll() {
    return this.packagesService.getAllPackages();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.packagesService.getPackageById(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; updated_by: string }
  ) {
    return this.packagesService.updatePackageStatus(id, body.status, body.updated_by);
  }
}