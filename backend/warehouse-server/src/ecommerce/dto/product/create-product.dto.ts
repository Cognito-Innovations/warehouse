import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  Min,
  IsBoolean,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateEcommerceProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @IsUUID()
  @IsNotEmpty()
  sub_category_id: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  country_ids: string[];

  @IsString()
  image_url: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  discount_percentage: number;

  @IsNumber()
  @IsPositive()
  unit_value: number;

  @IsNumber()
  @Min(0)
  stock_quantity: number;

  @IsBoolean()
  is_active: boolean;

  @IsUUID()
  @IsNotEmpty()
  measurement_id: string;
}
