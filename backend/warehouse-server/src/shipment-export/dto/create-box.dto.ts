import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBoxDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  length_cm: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  breadth_cm: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height_cm: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  volumetric_weight: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mass_weight: number;
}
