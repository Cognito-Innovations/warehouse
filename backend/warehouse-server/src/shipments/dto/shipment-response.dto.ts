import { Country } from 'src/Countries/country.entity';
import { Package } from 'src/packages/entities';
import { Rack } from 'src/racks/rack.entity';
import { User } from 'src/users/user.entity';
import { TrackingRequestResponseDto } from 'src/tracking-requests/dto/tracking-request-response.dto';
import { DocumentResponseDto } from 'src/documents/dto/document-response.dto';
import { InvoiceResponseDto } from 'src/invoice/dto/invoice-response.dto';

export class ShipmentPieceResponseDto {
  id: string;
  piece_number: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  volumetric_weight: number;
  created_at: number;
  updated_at: number;
}

export class ShipmentResponseDto {
  id: string;
  shipment_no: string;
  tracking_no: string;
  status: string;
  user: User;
  country: Country;
  packages: Package[];
  invoice?: InvoiceResponseDto;
  pieces?: ShipmentPieceResponseDto[];
  rack_slot: Rack | null;
  tracking_requests?: TrackingRequestResponseDto[];
  payment_slips?: DocumentResponseDto[];
  shipment_photos?: DocumentResponseDto[];
  customs_value: number;
  dangerous_good: boolean;
  total_weight: number;
  total_volumetric_weight: number;
  length: number | null;
  width: number | null;
  height: number | null;
  created_at: number;
  updated_at: number;
}
