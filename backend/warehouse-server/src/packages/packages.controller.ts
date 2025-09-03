import { Body, Controller, Get, Post } from '@nestjs/common';

import { PackagesService } from './packages.service';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  async create(@Body() body: any) {
    return this.packagesService.createPackage(body);
  }

  @Get()
  async findAll() {
    return this.packagesService.getAllPackages();
  }
}