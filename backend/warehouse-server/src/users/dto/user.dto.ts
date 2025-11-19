export class UserDto {
  id: string;
  email: string;
  name?: string;
  suite_no: string;
  role: string;
  id_card_passport_no?: string;
  identifier: string;
  phone_number?: string;
  alternate_phone_number?: string;
  gender?: string;
  dob?: Date;
  verified: boolean;
  email_verified: boolean;
  created_at?: number;
  updated_at?: number;
  last_logout?: number;
}
