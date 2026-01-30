import { UserPreferenceResponseDto } from 'src/user-preferences/dto/user-preference-response.dto';
import { UserAddressResponseDto } from 'src/user_address/dto/user-address-response.dto';

export class UserResponseDto {
  id: string;
  email: string;
  id_card_passport_no: string;
  name: string;
  role: string;
  suite_no: string;
  phone_code?: string;
  phone_number?: string;
  alternate_phone_number?: string;
  gender?: string;
  dob?: Date;
  preference?: UserPreferenceResponseDto;
  address?: UserAddressResponseDto[];
  identifier: string;
  verified: boolean;
  email_verified: boolean;
  created_at: number;
  updated_at: number;
}
