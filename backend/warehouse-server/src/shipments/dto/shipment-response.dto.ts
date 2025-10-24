import { Country } from 'src/Countries/country.entity';
import { Package } from 'src/packages/entities';
import { User } from 'src/users/user.entity';

export class ShipmentResponseDto {
  id: string;
  shipment_no: string;
  tracking_no: string;
  status: string;
  user: User;
  country: Country;
  packages: Package[];
  created_at: number;
  updated_at: number;
}