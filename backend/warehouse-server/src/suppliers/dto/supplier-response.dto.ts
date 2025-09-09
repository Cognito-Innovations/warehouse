import { Country } from 'src/Countries/country.entity';

export class SupplierResponseDto {
  id: string;
  country: Country;
  supplier_name: string;
  contact_number?: string;
  postal_code?: string;
  address?: string;
  website?: string;
  created_at?: number;
  updated_at?: number;
}
