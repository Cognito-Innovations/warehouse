import { UserPreference } from 'src/user-preferences/user-preference.entity';
import { UserAddress } from 'src/user_address/user_address.entity';

export class UserResponseDto {
  id: string;
  email: string;
  id_card_passport_no: string;
  name: string;
  role: string;
  suite_no: string;
  phone_number?: string;
  alternate_phone_number: string;
  gender?: string;
  dob?: Date;
  preference?: UserPreference;
  address?: UserAddress[];
  identifier: string;
  verified: boolean;
  email_verified: boolean;
  created_at: number;
  updated_at: number;
}