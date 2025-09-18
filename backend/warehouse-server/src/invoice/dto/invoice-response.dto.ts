import { ProductResponseDto } from 'src/products/dto/product-response.dto';

export class InvoiceResponseDto {
  id: string;
  invoice_no: string;
  amount: string;
  total: string;
  status: string;
  products: ProductResponseDto[];
  created_at: number;
  updated_at: number;
}
