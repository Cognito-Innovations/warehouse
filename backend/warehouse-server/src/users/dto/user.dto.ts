import { Country } from '../../supported-countries/entity/supported-country.entity';

export class UserDto {
  id: string;
  email: string;
  name?: string;
  image?: string;
  suite_no: string;
  identifier?: string;
  phone_number?: string;
  phone_number_2?: string;
  gender?: string;
  dob?: Date;
  verified: boolean;
  country: string;
  created_at?: Date;
  updated_at?: Date;
}
