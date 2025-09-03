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