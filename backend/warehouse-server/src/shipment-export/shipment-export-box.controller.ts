import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ShipmentExportBoxesService } from './shipment-export-box.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { ShipmentExportBox } from './shipment-export-box.entity';

@ApiTags('Shipment Export Boxes')
@Controller('shipment-export-boxes')
export class ShipmentExportBoxesController {
  constructor(private readonly boxesService: ShipmentExportBoxesService) {}

  @Post(':exportId')
  @ApiOperation({ summary: 'Create a new box for a shipment export' })
  @ApiCreatedResponse({
    description: 'Box created successfully',
    type: ShipmentExportBox,
  })
  @ApiBody({
    type: CreateBoxDto,
    examples: {
      Example1: {
        summary: 'Standard Box',
        value: {
          label: 'Box 1',
          length_cm: 50,
          breadth_cm: 40,
          height_cm: 30,
          volumetric_weight: 12.5,
          mass_weight: 10,
        },
      },
    },
  })
  async createBox(
    @Param('exportId') exportId: string,
    @Body() dto: CreateBoxDto,
  ) {
    return this.boxesService.createBox(exportId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shipment export box' })
  @ApiOkResponse({
    description: 'Box updated successfully',
    type: ShipmentExportBox,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        label: { type: 'string', example: 'Updated Box 1' },
        length_cm: { type: 'number', example: 55 },
        breadth_cm: { type: 'number', example: 42 },
        height_cm: { type: 'number', example: 32 },
        volumetric_weight: { type: 'number', example: 13.2 },
        mass_weight: { type: 'number', example: 11 },
      },
    },
  })
  async updateBox(@Param('id') id: string, @Body() dto: Partial<CreateBoxDto>) {
    return this.boxesService.updateBox(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipment export box by ID' })
  @ApiOkResponse({
    description: 'Box deleted successfully',
    schema: { example: { success: true } },
  })
  @ApiResponse({ status: 404, description: 'Box not found' })
  async deleteBox(@Param('id') id: string) {
    return this.boxesService.deleteBox(id);
  }

  @Get(':boxId/packages')
  @ApiOperation({ summary: 'Get all packages in a specific box' })
  @ApiOkResponse({ description: 'List of packages in the box.' })
  async getPackagesInBox(@Param('boxId') boxId: string) {
    return this.boxesService.getPackagesByBoxId(boxId);
  }

  @Post(':boxId/packages')
  @ApiOperation({ summary: 'Add a package to a box' })
  @ApiBody({ schema: { properties: { packageId: { type: 'string' } } } })
  @ApiOkResponse({ description: 'Package added to the box successfully.' })
  async addPackageToBox(
    @Param('boxId') boxId: string,
    @Body('packageId') packageId: string,
  ) {
    return this.boxesService.addPackageToBox(boxId, packageId);
  }

  @Delete(':boxId/packages/:packageId')
  @ApiOperation({ summary: 'Remove a package from a box' })
  @ApiOkResponse({ description: 'Package removed from the box successfully.' })
  async removePackageFromBox(
    @Param('boxId') boxId: string,
    @Param('packageId') packageId: string,
  ) {
    return this.boxesService.removePackageFromBox(packageId);
  }
}
