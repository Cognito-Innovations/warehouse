import { IsOptional, IsString } from 'class-validator';

export class UpdateEcommerceSubCategoryDto {
  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  country_id?: string;
}
