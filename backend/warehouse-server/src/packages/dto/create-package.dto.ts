import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PackagePieceDto {
  @IsString()
  @IsNotEmpty()
  weight: string;

  @IsString()
  @IsOptional()
  length?: string;

  @IsString()
  @IsOptional()
  width?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  volumetric_weight?: string;
}

export class CreatePackageDto {
  @IsString()
  //TODO: Remove comment
  // @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  rack_slot: string;

  @IsString()
  @IsNotEmpty()
  vendor: string;

  @IsString()
  @IsNotEmpty()
  tracking_no: string;

  @IsString()
  @IsOptional()
  status?: string;


  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  length?: string;

  @IsString()
  @IsOptional()
  width?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  volumetric_weight?: string;

  @IsBoolean()
  @IsOptional()
  dangerous_good?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_user_items?: boolean;

  @IsBoolean()
  @IsOptional()
  shop_invoice_received?: boolean;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  created_by?: string;

  @IsString()
  @IsOptional()
  package_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackagePieceDto)
  @IsOptional()
  pieces?: PackagePieceDto[];
}
