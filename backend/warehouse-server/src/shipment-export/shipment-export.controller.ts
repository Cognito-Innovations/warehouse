import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ShipmentExportsService } from './shipment-export.service';
import { CreateExportDto } from './dto/create-export.dto';

@Controller('shipment-exports')
export class ShipmentExportsController {
  constructor(private readonly exportsService: ShipmentExportsService) {}

  @Post()
  async createExport(@Body() dto: CreateExportDto) {
    return this.exportsService.createExport(dto);
  }

  @Get()
  async findAll() {
    return this.exportsService.getAllExports();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.exportsService.getExportById(id);
  }

  @Patch(':id')
  async updateExport(@Param('id') id: string, @Body() payload: Partial<{ mawb: string }>) {
    return this.exportsService.updateExport(id, payload);
  }

  @Delete(':id')
  async deleteExport(@Param('id') id: string) {
    return this.exportsService.deleteExport(id);
  }
}