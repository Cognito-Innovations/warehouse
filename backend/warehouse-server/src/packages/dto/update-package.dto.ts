import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  tracking_no?: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsString()
  volumetric_weight?: string;

  @IsOptional()
  @IsBoolean()
  dangerous_good?: boolean;

  @IsOptional()
  @IsString()
  rack_slot?: string;
}
