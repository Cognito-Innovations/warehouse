import {
  IsBoolean,
  IsString,
  IsOptional,
  ValidateIf,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { CargoType } from 'src/ecommerce/entities/ecommerce-category.entity';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @ValidateIf((o, v) => v !== null)
  @IsString()
  @IsOptional()
  country_id?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount_percentage?: number;

  @IsEnum(CargoType)
  @IsOptional()
  cargo_type?: CargoType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
