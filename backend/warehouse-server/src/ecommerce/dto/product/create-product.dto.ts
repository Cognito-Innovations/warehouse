import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  Min,
  IsBoolean,
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

  @IsUUID()
  @IsNotEmpty()
  country_id: string;

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
