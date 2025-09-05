import { Body, Controller, Get, Post } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryResponseDto } from './dto/country-response.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  async create(@Body() createCountryDto: CreateCountryDto): Promise<CountryResponseDto> {
    return this.countriesService.createCountry(createCountryDto);
  }

  @Post('bulk')
  async createBulk(@Body() body: { countries: string[] }): Promise<CountryResponseDto[]> {
    return this.countriesService.createCountriesBulk(body.countries);
  }

  @Get()
  async findAll(): Promise<CountryResponseDto[]> {
    return this.countriesService.getAllCountries();
  }
}