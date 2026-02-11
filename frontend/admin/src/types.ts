import type { UserRole } from "./data/menuItems";

export interface UserData {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: UserRole;
  preference?: {
    courier?: {
      country?: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
}

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
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image?:string;
}

export interface Customer {
  id: string;
  suite_no: string;
  name: string;
  email: string;
  role: string;
  phone_number: string;
  gender?: 'male' | 'female' | 'other' | null;
  dob?: string | null;
  verified: boolean;
  email_verified: boolean;
  is_active: boolean;
  identifier?: 'google' | 'email' | undefined;
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
  actual_id?: string;
  user_id?: string;
  name: string;
  suite_no: string;
  email: string;
  phone_number?: string;
  phone_number_2?: string;
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
  allow_user_items?: boolean;
  shop_invoice_received?: boolean;
  remarks?: string;
  status?: { value: string };
  created_by?: string;
  creator?: {
    id: string;
    name: string;
  };
  user?: {
    name?: string;
    suite_no?: string;
    email?: string;
    phone_number?: string;
    phone_number_2?: string;
  };
  shipment_uuid: string;
  created_at?: string;
  updated_at?: string;
  items?: unknown[];
  documents?: unknown[];
  measurements?: unknown[];
  charges?: unknown[];
  action_logs?: unknown[];
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
  name: string;
  currency_symbol: string;
  rate: number;
  currency_code: string;
}

export type CreateCountryPayload = Partial<Country>;
export type UpdateCountryPayload = Partial<CreateCountryPayload>;

export type CreateCurrencyPayload = {
  name: string;
  currency_symbol: string;
  currency_code: string;
  rate: number;
};

export type UpdateCurrencyPayload = Partial<CreateCurrencyPayload>;

export type CreateCourierPayload = Omit<Courier, 'id' | 'country_name'>;
export type UpdateCourierPayload = Partial<CreateCourierPayload>;

export interface PackageItem {
  [key: string]: unknown;
}

export interface PackageData {
  id: string;
  package_id: string;
  user?: {
    name: string;
    suite_no?: string;
  }
  total_weight?: string;
  items?: PackageItem[];
  created_at: string | Date;
}

export interface CategoryPayload {
  id?: string;
  name: string;
  slug: string;
  discount_percentage: number,
  // TODO: Uncomment the country selection when it's required
  // country_ids: string[],
  is_active: boolean;
  image_url: string;
  description: string;
};

export interface SubCategoryPayload {
  id?: string;
  category_id: string;
  name: string;
  slug: string;
  // image_url: string;
  discount_percentage: number,
  // TODO: Uncomment the country selection when it's required
  // country_ids: string[],
  is_active: boolean;
};

export interface ProductPayload {
  id?: string;
  category_id: string;
  sub_category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_percentage: number;
  image_url: string;
  unit_value: number;
  measurement_id: string;
  // TODO: Uncomment the country selection when it's required
  // country_ids: string[],
  cargo_option_id: string;
  stock_quantity: number;
  is_active: boolean;
};

export interface CargoOption {
  id: string;
  label: string;
}

export interface DashboardMetrics {
  customers: number;
  activePackages: number;
  actionRequiredPackages: number;
  shipRequestShipments: number;
  paymentPendingShipments: number;
  paymentApprovalShipments: number;
  readyToShipShipments: number;
  shippedShipments: number;
  pickupRequested: number;
  shoppingRequested: number;
  quotationConfirm: number;
  assistPaymentApproval: number;
}

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  category: string;
  category_id: string;
  sub_category: string;
  sub_category_id: string;
  price: {
    price: number;
    currency: string;
  };
  discount_percentage: number;
  unit: string;
  unit_value: number;
  measurement_id: string;
  stock_quantity: number;
  // countries: Country[];
  cargo_type_label: string;
  cargo_option_id: string;
  status: string;
}

export interface SubCategoryRow {
  id: string;
  name: string;
  slug: string;
  discount_percentage: number,
  // countries: Country[],
  categoryName: string;
  categoryId: string | null;
  products: number;
  status: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  discount_percentage: number,
  // countries: Country[],
  products: number;
  image_url: string;
  description: string;
  status: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  user_name: string;
  cashfree_payment_id: string;
  items_count: string;
  total_amount: string;
  payment_mode: string;
  created_at: string;
  status: string;
  payment_status: string;
}

export interface ShoppingRequestFiltersProps {
  originCountry: string | null;
  targetCountry: string | null;
  onOriginChange: (value: string | null) => void;
  onTargetChange: (value: string | null) => void;
}

export interface ShoppingRequestProduct {
  id: string;
  name?: string;
  quantity: number;
  unit_price?: number | null;
  currency?: string;
  available?: boolean;
  [key: string]: unknown;
}

export interface StatusCard {
  title: string;
  value: number;
  color: string;
  bgColor: string;
  icon: string;
  status: string;
}

export interface ItemDetail {
  name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface BoxItem {
  id: string;
  label: string;
  length_cm: number;
  breadth_cm: number;
  height_cm: number;
  volumetric_weight?: number;
  mass_weight?: number;
}

export interface BoxFormValues {
  label: string;
  length: string;
  breadth: string;
  height: string;
  volumetricWeight: string;
  massWeight: string;
}

export interface Shipment {
  id: string;
  tracking_no: string;
  shipment_no: string;
  courier: string;
  customer: string;
  customerCode: string;
  updated_at: string;
  time: string;
  user: {
    name: string;
  }
}