import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCourierCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  country_id: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
