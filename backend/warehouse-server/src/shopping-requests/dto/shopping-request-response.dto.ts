import { DocumentResponseDto } from '../../documents/dto/document-response.dto';

export interface SafeUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  suite_no?: string | null;
  verified?: boolean;
}

export class ShoppingRequestResponseDto {
  id: string;
  user_id: string;
  user?: SafeUser;
  request_code: string;
  country: string;
  items: number;
  shopping_request_products?: any[];
  remarks?: string;
  status: string;
  payment_slips?: DocumentResponseDto[];
  created_at: number;
  updated_at: number;
}
