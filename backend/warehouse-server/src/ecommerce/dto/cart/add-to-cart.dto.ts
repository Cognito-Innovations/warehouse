import { IsNotEmpty, IsUUID, IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
