import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MinLength,
  IsNumber,
} from 'class-validator';

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

  @IsString()
  @MinLength(6)
  suite_no?: string;

  @IsOptional()
  @IsString()
  identifier?: Identifier;

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

  @IsBoolean()
  verified: boolean;

  @IsOptional()
  @IsNumber()
  last_logout?: number;
}
