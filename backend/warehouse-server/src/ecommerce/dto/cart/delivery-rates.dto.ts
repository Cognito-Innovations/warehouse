import { IsArray, IsNotEmpty } from 'class-validator';

export class DeliveryRatesDto {
  @IsArray()
  @IsNotEmpty()
  productIds: string[];
}
