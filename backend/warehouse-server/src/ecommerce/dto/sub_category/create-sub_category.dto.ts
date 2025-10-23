import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateEcommerceSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsUUID()
  @IsNotEmpty()
  country_id: string;

  @IsNumber()
  @Min(0)
  discount_percentage: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
