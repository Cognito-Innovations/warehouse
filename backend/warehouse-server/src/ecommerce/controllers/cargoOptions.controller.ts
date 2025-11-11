import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateEcommerceCargoOptionDto } from '../dto/cargo_option/create-cargo-option.dto';
import { CargoOptionsService } from '../services/cargo-options.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('ecommerce-cargo-options')
export class CargoOptionsController {
  constructor(private readonly cargoOptionsService: CargoOptionsService) {}

  @Post()
  create(@Body() createEcommerceCargoOptionDto: CreateEcommerceCargoOptionDto) {
    return this.cargoOptionsService.create(createEcommerceCargoOptionDto);
  }

  @Get()
  findAll() {
    return this.cargoOptionsService.findAll();
  }
}
