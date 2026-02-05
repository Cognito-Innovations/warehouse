import {
  // ArrayMinSize,
  // IsArray,
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

  // TODO: Uncomment the country filtering when it's required
  // @IsArray()
  // @IsUUID('all', { each: true })
  // @ArrayMinSize(1)
  // country_ids: string[];

  @IsNumber()
  @Min(0)
  discount_percentage: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  is_active: boolean;
}
