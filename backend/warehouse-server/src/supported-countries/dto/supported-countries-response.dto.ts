import { Country } from 'src/Countries/country.entity';

export class SupportedCountryResponseDto {
  id: string;
  country: Country;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}
