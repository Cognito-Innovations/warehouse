import { IsNotEmpty, IsUUID, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsUUID()
  @IsOptional()
  measurement_id?: string;
}
