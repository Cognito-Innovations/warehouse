import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RacksService } from './racks.service';
import { CreateRackDto } from './dto/create-rack.dto';
import { RackResponseDto } from './dto/rack-response.dto';

@Controller('racks')
export class RacksController {
  constructor(private readonly racksService: RacksService) {}

  @Post()
  async create(@Body() createRackDto: CreateRackDto): Promise<RackResponseDto> {
    return this.racksService.createRack(createRackDto);
  }

  @Get()
  async findAll(): Promise<RackResponseDto[]> {
    return this.racksService.getAllRacks();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateRackDto>
  ): Promise<RackResponseDto> {
    return this.racksService.updateRack(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.racksService.deleteRack(id);
  }
}