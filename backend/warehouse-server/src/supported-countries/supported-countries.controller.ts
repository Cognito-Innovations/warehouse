import { Body, Controller, Get, Post } from '@nestjs/common';
import { SupportedCountryCreateDto } from './dto/create-supported-country.dto';
import { SupportedCountryResponseDto } from './dto/supported-countries-response.dto';
import { SupportedCountriesService } from './service/supported-countries.services';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('supported-countries')
export class SupportedCountriesController {
  constructor(
    private readonly supportedCountriesService: SupportedCountriesService,
  ) {}

  @Post()
  @Public()
  create(
    @Body() supportedCountryCreateDto: SupportedCountryCreateDto,
  ): Promise<SupportedCountryResponseDto> {
    return this.supportedCountriesService.createSupportedCountry(
      supportedCountryCreateDto,
    );
  }

  @Post('bulk')
  createBulk(
    @Body() body: { countries: SupportedCountryCreateDto[] },
  ): Promise<SupportedCountryResponseDto[]> {
    return this.supportedCountriesService.createSupportedCountriesBulk(
      body.countries,
    );
  }

  @Get()
  findAll(): Promise<SupportedCountryResponseDto[]> {
    return this.supportedCountriesService.getAllSupportedCountries();
  }
}
