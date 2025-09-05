export class PickupRequestResponseDto {
  id: string;
  user_id: string;
  pickup_address: string;
  supplier_name: string;
  supplier_phone: string;
  alt_phone?: string;
  pcs_box: number;
  est_weight?: number;
  pkg_details: string;
  remarks?: string;
  status: string;
  price?: number;
  quoted_at?: Date;
  confirmed_at?: Date;
  picked_at?: Date;
  created_at: Date;
  updated_at: Date;
}
