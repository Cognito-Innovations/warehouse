import {
  IsBoolean,
  IsString,
  IsOptional,
  // ValidateIf,
  IsNumber,
  Min,
  // IsArray,
  // IsUUID,
} from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  // TODO: Uncomment the country filtering when it's required
  // @ValidateIf((o, v) => v !== null)
  // @IsArray()
  // @IsUUID('all', { each: true })
  // @IsOptional()
  // country_ids?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount_percentage?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
