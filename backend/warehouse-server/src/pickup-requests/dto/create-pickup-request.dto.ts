import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreatePickupRequestDto {
  @IsString()
  user_id: string;

  @IsString()
  pickup_address: string;

  @IsString()
  supplier_name: string;

  @IsString()
  supplier_phone: string;

  @IsOptional()
  @IsString()
  alt_phone?: string;

  @IsNumber()
  @IsPositive()
  pcs_box: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  est_weight?: number;

  @IsString()
  pkg_details: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
