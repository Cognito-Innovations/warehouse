import { IsString, IsNumber, IsPositive } from 'class-validator';

export class UpdatePackageItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unit_price: number;

  @IsNumber()
  @IsPositive()
  total_price: number;
}
