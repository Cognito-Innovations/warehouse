import { Repository } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Country, CountryPhoneCode } from './country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryResponseDto } from './dto/countries-response.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async createCountry(
    createCountryDto: CreateCountryDto,
  ): Promise<CountryResponseDto> {
    try {
      const country = this.countryRepository.create({
        code: createCountryDto.code,
        name: createCountryDto.name,
        image: createCountryDto.image,
        phone_code: createCountryDto.phone_code,
      } as Partial<Country>);

      const savedCountry = await this.countryRepository.save(country);

      return {
        id: savedCountry.id,
        code: savedCountry.code,
        name: savedCountry.name,
        image: savedCountry.image,
        phone_code: savedCountry.phone_code as CountryPhoneCode,
        created_at: savedCountry.created_at,
        updated_at: savedCountry.updated_at,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create country';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCountriesBulk(countries: CreateCountryDto[]): Promise<Country[]> {
    try {
      const countryEntities = countries.map((country) =>
        this.countryRepository.create({
          code: country.code,
          name: country.name,
          image: country.image,
          phone_code: country.phone_code,
        } as Partial<Country>),
      );

      const savedCountries = await this.countryRepository.save(countryEntities);
      return savedCountries;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create countries';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCountries(): Promise<CountryResponseDto[]> {
    try {
      const countries = await this.countryRepository.find({
        order: { code: 'ASC' },
      });

      return countries.map((country) => ({
        ...country,
        phone_code: country.phone_code as CountryPhoneCode,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch countries';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCountry(id: string, updateCountryDto: UpdateCountryDto) {
    try {
      const data = updateCountryDto;

      const country = await this.countryRepository.update({ id }, data);

      if (!country) {
        throw new NotFoundException(`Country with ID "${id}" not found`);
      }
      return { status: 'success' };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update country';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
