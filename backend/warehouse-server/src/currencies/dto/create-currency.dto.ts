import { IsString, IsNumber, IsNotEmpty, Min, IsUUID } from 'class-validator';

export class CreateCurrencyDto {
  @IsUUID()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  currency_symbol: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  rate: number;
}
