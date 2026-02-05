import { IsArray, IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;
}
