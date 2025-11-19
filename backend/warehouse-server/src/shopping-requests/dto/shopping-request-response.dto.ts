import { TrackingRequestResponseDto } from 'src/tracking-requests/dto/tracking-request-response.dto';
import { DocumentResponseDto } from '../../documents/dto/document-response.dto';
import { InvoiceResponseDto } from 'src/invoice/dto/invoice-response.dto';

export interface SafeUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  suite_no?: string | null;
  verified?: boolean;
}

export interface ShoppingRequestProduct {
  id?: string,
  shopping_request_id?: string,
  created_at?: number,
  updated_at?: number,
  name?: string,
  description?: string,
  unit_price?: string | number | null,
  currency?: string,
  quantity?: number,
  url?: string,
  size?: string,
  color?: string,
  variants?: string,
  if_not_available_quantity?: string,
  if_not_available_color?: string,
  available?: boolean
}

export class ShoppingRequestResponseDto {
  id: string;
  user_id: string;
  user?: SafeUser;
  request_code: string;
  courier: string;
  items_count: number;
  shopping_request_products?: ShoppingRequestProduct[];
  remarks?: string;
  status: string;
  payment_slips?: DocumentResponseDto[];
  tracking_requests?: TrackingRequestResponseDto[];
  invoice?: InvoiceResponseDto;
  created_at: number;
  updated_at: number;
}
