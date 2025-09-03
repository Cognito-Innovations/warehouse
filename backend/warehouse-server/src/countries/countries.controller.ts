import { Body, Controller, Get, Post } from '@nestjs/common';

import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  async create(@Body('country') country: string) {
    return this.countriesService.createCountry(country);
  }

  @Post('bulk')
  async createBulk(@Body() body: { countries: string[] }) {
    return this.countriesService.createCountriesBulk(body.countries);
  }

  @Get()
  async findAll() {
    return this.countriesService.getAllCountries();
  }
}