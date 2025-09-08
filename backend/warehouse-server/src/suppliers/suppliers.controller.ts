import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';

@ApiTags('Suppliers')
@ApiBearerAuth()
@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiCreatedResponse({
    description: 'Supplier created successfully',
    type: SupplierResponseDto,
  })
  @ApiBody({
    type: CreateSupplierDto,
    examples: {
      Example1: {
        summary: 'Basic Supplier',
        value: {
          country: 'country-uuid',
          supplier_name: 'Tech Supplies Co.',
          contact_number: '+91-9876543210',
          postal_code: '110001',
          address: '123 Industrial Area, Delhi',
          website: 'https://techsupplies.example.com',
        },
      },
    },
  })
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<SupplierResponseDto> {
    return this.suppliersService.createSupplier(createSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all suppliers (sorted by name)' })
  @ApiOkResponse({
    description: 'List of suppliers',
    type: [SupplierResponseDto],
  })
  async findAll(): Promise<SupplierResponseDto[]> {
    return this.suppliersService.getAllSuppliers();
  }
}
