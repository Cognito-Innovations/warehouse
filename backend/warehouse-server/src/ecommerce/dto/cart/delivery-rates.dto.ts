import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeliveryRatesDto {
  @IsArray()
  @IsNotEmpty()
  productIds: string[];

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  currencyCode?: string;
}
