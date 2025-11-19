import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryResponseDto } from './dto/countries-response.dto';
import { CountriesService } from './countries.services';
import { UpdateCountryDto } from './dto/update-country.dto';

@ApiTags('Countries')
@ApiExtraModels(CreateCountryDto, CountryResponseDto)
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new country' })
  @ApiCreatedResponse({
    description: 'Country created successfully',
    type: CountryResponseDto,
  })
  @ApiBody({
    type: CreateCountryDto,
    examples: {
      India: {
        summary: 'Example for India',
        value: {
          code: 'IN',
          name: 'India',
          image: 'https://example.com/flags/india.png',
          phone_code: '+91',
        },
      },
    },
  })
  async create(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountryResponseDto> {
    return this.countriesService.createCountry(createCountryDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple countries at once' })
  @ApiCreatedResponse({
    description: 'Countries created successfully',
    type: [CountryResponseDto],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        countries: {
          type: 'array',
          items: { $ref: getSchemaPath(CreateCountryDto) },
          example: [
            {
              code: 'IN',
              name: 'India',
              image: 'https://example.com/flags/india.png',
              phone_code: '+91',
            },
            {
              code: 'USA',
              name: 'United States of America',
              image: 'https://example.com/flags/usa.png',
              phone_code: '+1',
            },
          ],
        },
      },
    },
  })
  async createBulk(
    @Body() body: { countries: CreateCountryDto[] },
  ): Promise<CountryResponseDto[]> {
    return this.countriesService.createCountriesBulk(body.countries);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiOkResponse({
    description: 'List of countries',
    type: [CountryResponseDto],
  })
  async findAll(): Promise<CountryResponseDto[]> {
    return this.countriesService.getAllCountries();
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update a country' })
  @ApiOkResponse({
    description: 'Country updated successfully',
    type: CountryResponseDto,
  })
  @ApiBody({ type: UpdateCountryDto })
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countriesService.updateCountry(id, updateCountryDto);
  }
}
