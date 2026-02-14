import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UserContextService {
  constructor(private readonly dataSource: DataSource) {}

  async getUserPreferredCountryId(userId: string): Promise<string | null> {
    const countryRow = await this.dataSource
      .createQueryBuilder()
      .select('country.id', 'id')
      .from('user_preferences', 'up')
      .innerJoin('courier_companies', 'courier', 'courier.id = up.courier_id')
      .innerJoin('countries', 'country', 'country.id = courier.country_id')
      .where('up.user_id = :userId', { userId })
      .getRawOne<{ id: string }>();

    return countryRow?.id ?? null;
  }
}
