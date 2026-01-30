import { CourierResponseDto } from 'src/courier_companies/dto/courier-response.dto';

export class UserPreferenceResponseDto {
  id: string;
  courier?: CourierResponseDto;
}
