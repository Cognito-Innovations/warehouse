export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
}

export interface Rack {
  id: string;
  label: string;
  color: string;
  count: number;
}

export interface Supplier {
  id: string;
  country: string;
  supplier_name: string;
  contact_number?: string;
  postal_code?: string;
  address?: string;
  website?: string;
}

export interface Package {
  id?: string;
  customer: string;
  rack_slot: string;
  vendor?: string;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  volumetric_weight?: string;
  allow_customer_items?: boolean;
  shop_invoice_received?: boolean;
  remarks?: string;
}

export interface PickupRequest {
  id?: string;
  user_id: string;
  pickup_address: string;
  supplier_name: string;
  supplier_phone: string;
  alt_phone?: string;
  pcs_box: number;
  est_weight?: number;
  pkg_details: string;
  remarks?: string;
  status?: string;
}