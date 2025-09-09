import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SupportedCountryCreateDto } from '../dto/create-supported-country.dto';
import { SupportedCountryResponseDto } from '../dto/supported-countries-response.dto';
import { SupportedCountry } from '../supported-country.entity';

@Injectable()
export class SupportedCountriesService {
  constructor(
    @InjectRepository(SupportedCountry)
    private readonly supportedCountryRepository: Repository<SupportedCountry>,
  ) {}

  async createSupportedCountry(
    createSupportedCountryDto: SupportedCountryCreateDto,
  ): Promise<SupportedCountryResponseDto> {
    const country = this.supportedCountryRepository.create({
      country: createSupportedCountryDto.country,
      is_active: createSupportedCountryDto.is_active,
    });

    const savedCountry = await this.supportedCountryRepository.save(country);

    return {
      id: savedCountry.id,
      country: savedCountry.country,
      is_active: savedCountry.is_active,
      created_at: savedCountry.created_at,
      updated_at: savedCountry.updated_at,
    };
  }

  async createSupportedCountriesBulk(
    countries: SupportedCountryCreateDto[],
  ): Promise<SupportedCountryResponseDto[]> {
    const countryEntities = countries.map((country) =>
      this.supportedCountryRepository.create({
        country: country.country,
        is_active: country.is_active,
      }),
    );

    const savedCountries =
      await this.supportedCountryRepository.save(countryEntities);

    return savedCountries.map((country) => ({
      id: country.id,
      country: country.country,
      is_active: country.is_active,
      created_at: country.created_at,
      updated_at: country.updated_at,
    }));
  }

  async getAllSupportedCountries(): Promise<SupportedCountryResponseDto[]> {
    const countries = await this.supportedCountryRepository.find({
      order: { country: { code: 'ASC' } },
    });

    return countries.map((country) => ({
      id: country.id,
      country: country.country,
      is_active: country.is_active,
      created_at: country.created_at,
      updated_at: country.updated_at,
    }));
  }
}
