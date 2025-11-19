import { Controller, Get, Post, Body } from '@nestjs/common';
import { MeasurementService } from '../services/measurement.service';
import { CreateEcommerceMeasurementDto } from '../dto/measurement/create-measurement.dto';

@Controller('ecommerce-measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  create(@Body() createEcommerceMeasurementDto: CreateEcommerceMeasurementDto) {
    return this.measurementService.create(createEcommerceMeasurementDto);
  }

  @Get()
  findAll() {
    return this.measurementService.findAll();
  }
}
