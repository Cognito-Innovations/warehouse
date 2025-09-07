import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Country } from './country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryResponseDto } from './dto/countries-response.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async createCountry(
    createCountryDto: CreateCountryDto,
  ): Promise<CountryResponseDto> {
    const country = this.countryRepository.create({
      code: createCountryDto.code,
      name: createCountryDto.name,
      image: createCountryDto.image,
      phone_code: createCountryDto.phone_code,
    });

    const savedCountry = await this.countryRepository.save(country);

    return savedCountry;
  }

  async createCountriesBulk(
    countries: CreateCountryDto[],
  ): Promise<CountryResponseDto[]> {
    const countryEntities = countries.map((country) =>
      this.countryRepository.create({
        code: country.code,
        name: country.name,
        image: country.image,
        phone_code: country.phone_code,
      }),
    );

    const savedCountries = await this.countryRepository.save(countryEntities);

    return savedCountries.map((country) => ({
      id: country.id,
      code: country.code,
      name: country.name,
      image: country.image,
      phone_code: country.phone_code,
      created_at: country.created_at,
      updated_at: country.updated_at,
    }));
  }

  async getAllCountries(): Promise<CountryResponseDto[]> {
    const countries = await this.countryRepository.find({
      order: { code: 'ASC' },
    });

    return countries.map((country) => ({
      id: country.id,
      code: country.code,
      name: country.name,
      image: country.image,
      phone_code: country.phone_code,
      created_at: country.created_at,
      updated_at: country.updated_at,
    }));
  }
}
