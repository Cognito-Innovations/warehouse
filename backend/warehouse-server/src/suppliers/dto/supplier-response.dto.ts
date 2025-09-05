export class SupplierResponseDto {
  id: string;
  country: string;
  supplier_name: string;
  contact_number?: string;
  postal_code?: string;
  address?: string;
  website?: string;
  created_at?: Date;
  updated_at?: Date;
}
