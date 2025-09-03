import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { RacksService } from './racks.service';

@Controller('racks')
export class RacksController {
  constructor(private readonly racksService: RacksService) {}

  @Post()
  async create(@Body() body: { label: string; color: string; count?: number }) {
    return this.racksService.createRack(body);
  }

  @Get()
  async findAll() {
    return this.racksService.getAllRacks();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { label?: string; color?: string; count?: number }
  ) {
    return this.racksService.updateRack(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.racksService.deleteRack(id);
  }
}