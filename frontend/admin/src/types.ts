import type { UserRole } from "./data/menuItems";

export interface User {
  id: string;
  email: string;
  name: string;
  suite_no: string;
  phone_number: string | null;
  gender: 'male' | 'female' | 'other' | null;
  dob: string | null;
  role: UserRole,
  identifier: 'google' | 'email' | undefined;
  verified: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  suiteNo: string;
  name: string;
  id: string;
  email: string;
  isEmailVerified: boolean;
  emailVerifiedOn: string;
  phone: string;
  identifier: 'google' | 'email' | undefined;
  isVerified: boolean;
  isActive: boolean;
  gender?: 'male' | 'female' | 'other' | null;
  dob?: string;
}

export interface Rack {
  id: string;
  label: string;
  color: string;
  count: number;
}

export interface Supplier {
  id: string;
  country: Country;
  supplier_name: string;
  contact_number?: string;
  postal_code?: string;
  address?: string;
  website?: string;
}

export interface Package {
  id?: string;
  package_id?: string;
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

export interface Status {
  label: string;
  value: string;
}

export interface Courier {
  id: string;
  name: string;
  address: string;
  email: string;
  phone_number: string;
  country_id: string;
  country_name: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  phone_code: string;
  image?: string;
}

export interface Currency {
    id: string;
    currency_symbol: string;
    rate: number;
    country: Pick<Country, 'id' | 'name'>
}

export type CreateCountryPayload = Partial<Country>;
export type UpdateCountryPayload = Partial<CreateCountryPayload>;

export type CreateCurrencyPayload = { country: string; currency_symbol: string; rate: number };
export type UpdateCurrencyPayload = Partial<CreateCurrencyPayload>;

export type CreateCourierPayload = Omit<Courier, 'id' | 'country_name'>;
export type UpdateCourierPayload = Partial<CreateCourierPayload>;