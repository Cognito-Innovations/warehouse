import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsString()
  @IsNotEmpty()
  rack_slot: string;

  @IsString()
  @IsNotEmpty()
  vendor: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  dangerous_good?: boolean;

  @IsString()
  @IsNotEmpty()
  created_by: string;
}
