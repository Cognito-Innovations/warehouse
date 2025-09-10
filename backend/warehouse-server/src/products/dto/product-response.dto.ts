import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class ProductResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  shopping_request_id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  unit_price?: number;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  variants?: string;

  @IsOptional()
  @IsString()
  if_not_available_quantity?: string;

  @IsOptional()
  @IsString()
  if_not_available_color?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsDate()
  @IsOptional()
  created_at: number;

  @IsDate()
  @IsOptional()
  updated_at: number;
}
