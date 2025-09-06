import {
  IsString,
  IsOptional,
  IsPositive,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreatePickupRequestDto {
  @IsString()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  country_id: string;

  @IsString()
  pickup_address: string;

  @IsString()
  supplier_name: string;

  @IsString()
  supplier_phone_number: string;

  @IsOptional()
  @IsString()
  alt_supplier_phone_number?: string;

  @IsString()
  @IsPositive()
  pcs_box: string;

  @IsOptional()
  @IsString()
  @IsPositive()
  est_weight?: string;

  @IsString()
  pkg_details: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
