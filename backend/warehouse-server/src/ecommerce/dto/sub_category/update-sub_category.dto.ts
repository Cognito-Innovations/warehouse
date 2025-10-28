import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateEcommerceSubCategoryDto {
  @IsString()
  category_id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  country_id?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount_percentage?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
