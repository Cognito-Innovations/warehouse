export interface EcommerceCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description?: string;
  is_active: boolean;
  country: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface EcommerceSubCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description?: string;
  is_active: boolean;
  category: EcommerceCategory;
  country: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image_url: string;
  price: number;
  discount_percentage: number;
  quantity: number;
  measurement?: string;
  category: EcommerceCategory;
  sub_category: EcommerceSubCategory;
  country: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product: EcommerceProduct;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user_id: string;
  status: "ACTIVE" | "ABANDONED" | "CHECKED_OUT";
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product: EcommerceProduct;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CreateOrderRequest {
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
}
