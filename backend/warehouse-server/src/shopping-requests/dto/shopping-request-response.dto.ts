export class ShoppingRequestResponseDto {
  id: string;
  user_id: string;
  request_code: string;
  country: string;
  items: number;
  remarks?: string;
  status: string;
  payment_slips?: string[];
  created_at: Date;
  updated_at: Date;
}
