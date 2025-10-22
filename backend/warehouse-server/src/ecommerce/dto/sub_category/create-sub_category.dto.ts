import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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
  @IsOptional()
  category_id: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  country_id: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
