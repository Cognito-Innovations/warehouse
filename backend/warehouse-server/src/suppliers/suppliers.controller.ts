import { Body, Controller, Get, Post } from '@nestjs/common';

import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async create(@Body() body: {
    country: string;
    supplier_name: string;
    contact_number?: string;
    postal_code?: string;
    address?: string;
    website?: string;
  }) {
    return this.suppliersService.createSupplier(body);
  }

  @Get()
  async findAll() {
    return this.suppliersService.getAllSuppliers();
  }
}