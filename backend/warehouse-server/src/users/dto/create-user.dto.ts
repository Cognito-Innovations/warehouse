import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MinLength,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Role } from '../user.entity';

export enum Identifier {
  Google = 'google',
  Email = 'email',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  suite_no?: string;

  @IsOptional()
  @IsString()
  identifier?: Identifier;

  @IsOptional()
  @IsString()
  phone_code?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  alternate_phone_number?: string;

  @IsOptional()
  @IsString()
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsNumber()
  last_logout?: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  courier_id?: string;

  @IsOptional()
  @IsBoolean()
  shouldHashPassword?: boolean;
}
