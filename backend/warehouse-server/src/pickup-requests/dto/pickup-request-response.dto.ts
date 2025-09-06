export class PickupRequestResponseDto {
  id: string;
  country?: string;
  pickup_address: string;
  supplier_name: string;
  supplier_phone_number: string;
  alt_supplier_phone_number?: string;
  pcs_box: string;
  est_weight?: string;
  pkg_details: string;
  remarks?: string;
  price?: number;
  created_at: Date;
  updated_at: Date;
  user?: {
    email: string;
    name?: string;
    phone_number: string;
    country?: string;
    created_at: Date;
  };
}
