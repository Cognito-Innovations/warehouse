import { ProductResponseDto } from 'src/products/dto/product-response.dto';

export class InvoiceResponseDto {
  id: string;
  invoice_no: string;
  amount: number;
  total: number;
  status: string;
  products: ProductResponseDto[];
  created_at: number;
  updated_at: number;
}
