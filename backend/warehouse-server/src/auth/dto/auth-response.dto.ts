import { UserDto } from 'src/users/dto/user.dto';
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
