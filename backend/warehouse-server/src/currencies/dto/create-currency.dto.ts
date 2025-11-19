import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateCurrencyDto {
  @IsUUID()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  currency_symbol: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency_code: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  rate: number;
}
