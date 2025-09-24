import { IsString, IsNumber, IsPositive, Max } from 'class-validator';

export class CreatePackageItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  @Max(9999999)
  quantity: number;

  @IsNumber()
  @IsPositive()
  @Max(99999999.99)
  unit_price: number;

  @IsNumber()
  @IsPositive()
  total_price: number;
}
