import {
  // IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  // IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEcommerceSubCategoryDto {
  @IsString()
  category_id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  // TODO: Uncomment the country filtering when it's required
  // @IsArray()
  // @IsUUID('all', { each: true })
  // @IsOptional()
  // country_ids?: string[];

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  discount_percentage?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
