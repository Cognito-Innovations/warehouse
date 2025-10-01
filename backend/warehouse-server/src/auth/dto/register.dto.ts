import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  Matches,
} from 'class-validator';
import { Column } from 'typeorm';

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
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Matches(/[!@#$%^&*]/, {
    message: 'Password must contain at least one special character',
  })
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
  @Column({ type: 'bigint' })
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  is_logged_in?: boolean;

  @IsOptional()
  @Column({ type: 'bigint' })
  last_login?: number;

  @IsOptional()
  @Column({ type: 'bigint' })
  last_logout?: number;

  @IsOptional()
  @Column({ type: 'bigint' })
  created_at?: number;

  @IsOptional()
  @Column({ type: 'bigint' })
  updated_at?: number;
}
