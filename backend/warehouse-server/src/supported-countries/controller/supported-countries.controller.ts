import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCountryDto } from '../dto/create-supported-countries.dto';
import { CountryResponseDto } from '../dto/supported-countries-response.dto';
import { CountriesService } from '../service/supported-countries.services';
import { Public } from 'src/auth/decorators/public.decorator';

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
    @Body() body: { countries: string[] },
  ): Promise<CountryResponseDto[]> {
    return this.countriesService.createCountriesBulk(body.countries);
  }

  @Get()
  async findAll(): Promise<CountryResponseDto[]> {
    return this.countriesService.getAllCountries();
  }
}
