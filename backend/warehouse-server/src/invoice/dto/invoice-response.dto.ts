import { Product } from 'src/products/product.entity';

export class InvoiceResponseDto {
  id: string;
  invoice_no: string;
  amount: number;
  gst: number;
  total: number;
  status: string;
  products: Product[];
  created_at: number;
  updated_at: number;
}
