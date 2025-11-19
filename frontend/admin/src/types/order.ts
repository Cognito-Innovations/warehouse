export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  shipping_address: string;
}

export interface PaymentInfo {
  id: string;
  method: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_category: string;
  unit: string;
  quantity: number;
  price: number;
  discount_percent: number;
  subtotal: number;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export interface OrderDetails {
  id: string;
  status: string;
  order_date: string;
  delivery_date: string | null;
  customer_info: CustomerInfo;
  payment_info: PaymentInfo;
  items: OrderItem[];
  summary: OrderSummary;
}

export interface OrderRow {
  id: string;
  customer_name: string;
  payment_id: string;
  item_count: number;
  total: number;
  payment_method: string;
  order_date: string;
  status: string;
}