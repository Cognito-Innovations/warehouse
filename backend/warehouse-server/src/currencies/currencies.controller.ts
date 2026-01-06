import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }

  @Public()
  @Get('by-code/:code')
  findByCode(@Param('code') code: string) {
    return this.currenciesService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currenciesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currenciesService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currenciesService.remove(id);
  }
}
