import { Country } from 'src/Countries/country.entity';
import { DocumentSummaryDto } from 'src/documents/dto/document-response.dto';
import { UserPreference } from 'src/user-preferences/user-preference.entity';
import { UserAddress } from 'src/user_address/user_address.entity';

export class StatusDto {
  label: string;
  value: string;
}

export class PackageResponseDto {
  id: string;
  tracking_no: string;
  status: StatusDto;
  shipment_id?: string | null;
  shipment_uuid?: string | null;
  user?: {
    id: string;
    email: string;
    name?: string;
    suite_no: string;
    country?: string;
    phone_number: string;
    phone_number_2: string;
    preference?: UserPreference;
    address?: UserAddress[];
  };
  vendor?: {
    id: string;
    supplier_name: string;
    country: string;
  };
  rack_slot?: {
    id: string;
    label: string;
    count: number;
    color: string;
  };
  documents?: DocumentSummaryDto[];
  slot_info?: string;
  warehouse_location?: string;
  total_weight?: number | null;
  total_volumetric_weight?: number | null;
  country: Country;
  allow_user_items: boolean;
  shop_invoice_received: boolean;
  remarks?: string | null;
  dangerous_good: boolean;
  created_by?: {
    id: string;
    email: string;
    name?: string;
  };
  updated_by?: {
    id: string;
    email: string;
    name?: string;
  };
  package_id: string;
  created_at?: number;
  updated_at?: number;
  measurements?: PackageMeasurementResponseDto[];
  items?: PackageItemResponseDto[];
  charges?: PackageChargeResponseDto[];
}

export class PackageMeasurementResponseDto {
  id: string;
  package_id: string;
  piece_number: number;
  length: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
  has_measurements: boolean;
  measurement_verified: boolean;
}

export class PackageItemResponseDto {
  id: string;
  package_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: number;
  updated_at: number;
}

export class PackageChargeResponseDto {
  id: string;
  amount: string;
  created_at: number;
  updated_at: number;
}
