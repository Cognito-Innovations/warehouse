import { CountryCode, CountryPhoneCode } from '../country.entity';

export class CountryResponseDto {
  id: string;
  code: CountryCode;
  name: string;
  image: string;
  phone_code: CountryPhoneCode;
  created_at?: number;
  updated_at?: number;
}
