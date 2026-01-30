import { CountryResponseDto } from 'src/Countries/dto/countries-response.dto';

export class CourierResponseDto {
  id: string;
  name: string;
  country?: CountryResponseDto;
}
