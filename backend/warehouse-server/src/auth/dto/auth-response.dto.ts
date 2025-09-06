export class UserDto {
  id: string;
  email: string;
  name?: string;
  role: string;
  image?: string;
  suite_no?: string;
  identifier?: string;
  phone_number?: string;
  phone_number_2?: string;
  gender?: string;
  dob?: Date;
  verified?: boolean;
  country?: any; // Should be a CountryDto if available, else 'any'
  is_logged_in: boolean;
  last_login?: Date;
  last_logout?: Date;
  created_at: Date;
  updated_at: Date;
}

export class LoginResponseDto {
  user: UserDto;
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}

export class RegisterResponseDto {
  user: UserDto;
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  message: string;
}

export class RefreshTokenResponseDto {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}

export class ValidateResponseDto {
  valid: boolean;
  user?: UserDto;
}
