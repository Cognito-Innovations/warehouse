import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ShipmentExportsService } from './shipment-export.service';
import { CreateExportDto } from './dto/create-export.dto';
import { ShipmentExport } from './shipment-export.entity';
import type { AuthenticatedRequest } from 'src/shared/types/authenticated-request.type';

@ApiTags('Shipment Exports')
@Controller('shipment-exports')
export class ShipmentExportsController {
  constructor(private readonly exportsService: ShipmentExportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipment export' })
  @ApiCreatedResponse({
    description: 'Shipment export created successfully',
    type: ShipmentExport,
  })
  @ApiBody({
    type: CreateExportDto,
    examples: {
      Example1: {
        summary: 'Basic Export',
        value: {
          export_code: 'EXP-001',
          mawb: '123-45678901',
          boxes_count: 2,
          created_by: 'admin_123',
        },
      },
    },
  })
  async createExport(
    @Body() dto: CreateExportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    return this.exportsService.createExport(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipment exports' })
  @ApiOkResponse({
    description: 'List of all shipment exports',
    type: [ShipmentExport],
  })
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.exportsService.getAllExports(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shipment export by ID' })
  @ApiOkResponse({ description: 'Shipment export found', type: ShipmentExport })
  @ApiResponse({ status: 404, description: 'Export not found' })
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.exportsService.getExportById(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shipment export (MAWB only)' })
  @ApiOkResponse({
    description: 'Shipment export updated successfully',
    type: ShipmentExport,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mawb: { type: 'string', example: '987-65432109' },
      },
    },
  })
  async updateExport(
    @Param('id') id: string,
    @Body() payload: Partial<{ mawb: string }>,
  ) {
    return this.exportsService.updateExport(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipment export by ID' })
  @ApiOkResponse({
    description: 'Shipment export deleted successfully',
    schema: { example: { success: true } },
  })
  @ApiResponse({ status: 404, description: 'Export not found' })
  async deleteExport(@Param('id') id: string) {
    return this.exportsService.deleteExport(id);
  }

  @Patch(':id/departed')
  @ApiOperation({ summary: 'Mark shipment export as departed' })
  @ApiOkResponse({
    description: 'Shipment export marked as departed successfully',
    type: ShipmentExport,
  })
  async markAsDeparted(@Param('id') id: string) {
    return this.exportsService.markAsDeparted(id);
  }
}
