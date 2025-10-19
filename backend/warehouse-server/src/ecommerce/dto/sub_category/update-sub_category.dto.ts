import { IsOptional, IsString } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  country_id?: string;
}
