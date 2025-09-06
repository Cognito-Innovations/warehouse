import { User } from '../../users/user.entity';

export class ShoppingRequestResponseDto {
  id: string;
  user_id: string;
  user?: User; // Optional user object when fetched with relations
  request_code: string;
  country: string;
  items: number;
  shopping_request_products?: any[]; // Products related to this shopping request
  remarks?: string;
  status: string;
  payment_slips?: string[];
  created_at: Date;
  updated_at: Date;
}
