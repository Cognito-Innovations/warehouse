import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateEcommerceSubCategoryDto {
  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  country_id?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
