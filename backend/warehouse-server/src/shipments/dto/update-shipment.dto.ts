import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateShipmentDto {
  @IsOptional()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsNumber()
  length: number;

  @IsOptional()
  @IsNumber()
  width: number;

  @IsOptional()
  @IsNumber()
  height: number;

  @IsOptional()
  @IsString()
  rack_slot?: string;
}
