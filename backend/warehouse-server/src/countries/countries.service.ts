import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryResponseDto } from './dto/country-response.dto';

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
      name: createCountryDto.name,
    });

    const savedCountry = await this.countryRepository.save(country);

    return {
      id: savedCountry.id,
      name: savedCountry.name,
      created_at: savedCountry.created_at,
      updated_at: savedCountry.updated_at,
    };
  }

  async createCountriesBulk(
    countries: string[],
  ): Promise<CountryResponseDto[]> {
    const countryEntities = countries.map((name) =>
      this.countryRepository.create({ name }),
    );

    const savedCountries = await this.countryRepository.save(countryEntities);

    return savedCountries.map((country) => ({
      id: country.id,
      name: country.name,
      created_at: country.created_at,
      updated_at: country.updated_at,
    }));
  }

  async getAllCountries(): Promise<CountryResponseDto[]> {
    const countries = await this.countryRepository.find({
      order: { name: 'ASC' },
    });

    return countries.map((country) => ({
      id: country.id,
      name: country.name,
      created_at: country.created_at,
      updated_at: country.updated_at,
    }));
  }
}
