export class ProductResponseDto {
  id: string;
  shopping_request_id: string;
  name: string;
  description?: string;
  unit_price?: number;
  quantity: number;
  url?: string;
  created_at: Date;
  updated_at: Date;
}
