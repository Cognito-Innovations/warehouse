import {
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  Min,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateEcommerceProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsUUID()
  @IsOptional()
  sub_category_id?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  country_ids?: string[];

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount_percentage?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  unit_value?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock_quantity?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsUUID()
  @IsOptional()
  measurement_id?: string;

  @IsUUID()
  @IsOptional()
  cargo_option_id?: string;
}