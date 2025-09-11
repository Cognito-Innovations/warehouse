import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SupportedCountryCreateDto } from './dto/create-supported-country.dto';
import { SupportedCountryResponseDto } from './dto/supported-countries-response.dto';
import { SupportedCountriesService } from './service/supported-countries.services';

@ApiTags('Supported Countries')
@Controller('supported-countries')
export class SupportedCountriesController {
  constructor(
    private readonly supportedCountriesService: SupportedCountriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new supported country' })
  @ApiCreatedResponse({
    description: 'Supported country created successfully',
    type: SupportedCountryResponseDto,
  })
  @ApiBody({
    type: SupportedCountryCreateDto,
    examples: {
      Example1: {
        summary: 'Enable a country',
        value: {
          country: { id: 'country-uuid', code: 'IN', name: 'India' },
          is_active: true,
        },
      },
    },
  })
  create(
    @Body() supportedCountryCreateDto: SupportedCountryCreateDto,
  ): Promise<SupportedCountryResponseDto> {
    return this.supportedCountriesService.createSupportedCountry(
      supportedCountryCreateDto,
    );
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create supported countries in bulk' })
  @ApiCreatedResponse({
    description: 'Supported countries created successfully',
    type: [SupportedCountryResponseDto],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        countries: {
          type: 'array',
          items: { $ref: '#/components/schemas/SupportedCountryCreateDto' },
          example: [
            {
              country: { id: 'country-uuid-1', code: 'IN', name: 'India' },
              is_active: true,
            },
            {
              country: {
                id: 'country-uuid-2',
                code: 'US',
                name: 'United States',
              },
              is_active: false,
            },
          ],
        },
      },
    },
  })
  createBulk(
    @Body() body: { countries: SupportedCountryCreateDto[] },
  ): Promise<SupportedCountryResponseDto[]> {
    return this.supportedCountriesService.createSupportedCountriesBulk(
      body.countries,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all supported countries' })
  @ApiOkResponse({
    description: 'List of supported countries',
    type: [SupportedCountryResponseDto],
  })
  findAll(): Promise<SupportedCountryResponseDto[]> {
    return this.supportedCountriesService.getAllSupportedCountries();
  }
}
