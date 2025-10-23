import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @Min(0)
  discount_percentage: number;

  @IsUUID()
  @IsNotEmpty()
  country_id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
