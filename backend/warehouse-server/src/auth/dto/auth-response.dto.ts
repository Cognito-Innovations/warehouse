export class UserDto {
  id: string;
  email: string;
  is_logged_in: boolean;
  last_login?: Date;
  last_logout?: Date;
  created_at?: Date;
  country?: string;
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
