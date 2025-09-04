import { Injectable } from '@nestjs/common';

import { dbClient } from '../supabase/supabase.client';

@Injectable()
export class CountriesService {
  async createCountry(country: string) {
    const { data, error } = await dbClient
      .from('countries')
      .insert({ country })
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async createCountriesBulk(countries: string[]) {
    const bulkData = countries.map(c => ({ country: c }));
    const { data, error } = await dbClient
      .from('countries')
      .insert(bulkData)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllCountries() {
    const { data, error } = await dbClient.from('countries').select('*');

    if (error) throw new Error(error.message);
    return data;
  }
}