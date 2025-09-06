import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShipmentExportBoxesService } from './shipment-export-box.service';
import { CreateBoxDto } from './dto/create-box.dto';

@Controller('shipment-export-boxes')
export class ShipmentExportBoxesController {
  constructor(private readonly boxesService: ShipmentExportBoxesService) {}

  @Post(':exportId')
  async createBox(
    @Param('exportId') exportId: string,
    @Body() dto: CreateBoxDto,
  ) {
    return this.boxesService.createBox(exportId, dto);
  }

  @Patch(':id')
  async updateBox(
    @Param('id') id: string,
    @Body() dto: Partial<CreateBoxDto>,
  ) {
    return this.boxesService.updateBox(id, dto);
  }

  @Delete(':id')
  async deleteBox(@Param('id') id: string) {
    return this.boxesService.deleteBox(id);
  }
}