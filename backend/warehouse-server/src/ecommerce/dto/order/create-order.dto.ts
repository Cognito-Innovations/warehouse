import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Status } from 'src/ecommerce/entities/ecommerce-payments.entity';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  shipping_address?: string;

  @IsString()
  @IsOptional()
  billing_address?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  // @IsEnum(PaymentStatus)
  // @IsOptional()
  // payment_status?: PaymentStatus;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsArray()
  @IsString({ each: true })
  product_ids: string[];
}
