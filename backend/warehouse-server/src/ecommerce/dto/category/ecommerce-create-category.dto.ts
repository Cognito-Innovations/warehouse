import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

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

  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  country_ids: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_url: string;

  @IsUUID()
  @IsNotEmpty()
  cargo_option_id: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
