import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBoxDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsNumber()
  length_cm: number;

  @IsNumber()
  breadth_cm: number;

  @IsNumber()
  height_cm: number;

  @IsNumber()
  volumetric_weight: number;

  @IsNumber()
  mass_weight: number;
}