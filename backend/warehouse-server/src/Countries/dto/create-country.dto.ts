import { IsString, IsNotEmpty } from 'class-validator';
import { CountryCode } from '../country.entity';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  code: CountryCode;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  image: string;

  @IsString()
  @IsNotEmpty()
  phone_code: string;
}
