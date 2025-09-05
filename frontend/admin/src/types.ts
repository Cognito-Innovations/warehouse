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
  custom_package_id?: string;
  customer_id?: string;
  customer?: {
    id: string;
    name: string;
    suite_no: string;
    email: string;
    phone_number?: string;
    phone_number_2?: string;
  };
  rack_slot_id?: string;
  rack_slot?: {
    id: string;
    label: string;
    color: string;
    count: number;
  };
  vendor_id?: string;
  vendor?: {
    id: string;
    supplier_name: string;
    country: string;
    contact_number?: string;
    postal_code?: string;
    address?: string;
    website?: string;
  };
  tracking_no?: string;
  total_weight?: number;
  total_volumetric_weight?: number;
  dangerous_good?: boolean;
  allow_customer_items?: boolean;
  shop_invoice_received?: boolean;
  remarks?: string;
  status?: string;
  created_by?: string;
  creator?: {
    id: string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
  items?: any[];
  documents?: any[];
  measurements?: any[];
  charges?: any[];
  action_logs?: any[];
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