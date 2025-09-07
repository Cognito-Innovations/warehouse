import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryResponseDto } from './dto/countries-response.dto';
import { CountriesService } from './countries.services';

@Controller('country-services')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @Public()
  async create(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountryResponseDto> {
    return this.countriesService.createCountry(createCountryDto);
  }

  @Post('bulk')
  async createBulk(
    @Body() body: { countries: CreateCountryDto[] },
  ): Promise<CountryResponseDto[]> {
    return this.countriesService.createCountriesBulk(body.countries);
  }

  @Get()
  async findAll(): Promise<CountryResponseDto[]> {
    return this.countriesService.getAllCountries();
  }
}
