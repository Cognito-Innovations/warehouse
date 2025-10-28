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
  is_active: boolean;
}
