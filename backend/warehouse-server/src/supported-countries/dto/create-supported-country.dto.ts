import { IsString, IsNotEmpty } from 'class-validator';
import { Country } from 'src/Countries/country.entity';

export class SupportedCountryCreateDto {
  @IsString()
  @IsNotEmpty()
  country: Country;

  @IsString()
  @IsNotEmpty()
  is_active: boolean;
}
