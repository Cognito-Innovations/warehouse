import { Country } from 'src/Countries/country.entity';
import { Package } from 'src/packages/entities';
import { Rack } from 'src/racks/rack.entity';
import { User } from 'src/users/user.entity';
import { TrackingRequestResponseDto } from 'src/tracking-requests/dto/tracking-request-response.dto';

export class ShipmentResponseDto {
  id: string;
  shipment_no: string;
  tracking_no: string;
  status: string;
  user: User;
  country: Country;
  packages: Package[];
  rack_slot: Rack | null;
  tracking_requests: TrackingRequestResponseDto[];
  customs_value: number;
  dangerous_good: boolean;
  total_weight: number;
  total_volumetric_weight: number;
  length: number;
  width: number;
  height: number;
  created_at: number;
  updated_at: number;
}