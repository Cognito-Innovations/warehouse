import { IsBoolean, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  name?: string;

  @IsString()
  slug?: string;

  @IsString()
  image_url?: string;

  @IsString()
  country_id?: string;

  @IsString()
  description?: string;

  @IsBoolean()
  is_active?: boolean;
}
