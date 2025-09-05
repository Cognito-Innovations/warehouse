import { IsEmail, IsString, IsOptional, IsBoolean, IsDate, MinLength } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  suite_no?: string;

  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  phone_number_2?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  country?: any; // Should be a CountryDto if available, else 'any'

  @IsOptional()
  @IsBoolean()
  is_logged_in?: boolean;

  @IsOptional()
  @IsDate()
  last_login?: Date;

  @IsOptional()
  @IsDate()
  last_logout?: Date;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}
