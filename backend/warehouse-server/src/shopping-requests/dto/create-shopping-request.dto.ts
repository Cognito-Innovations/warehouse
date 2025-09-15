import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { ShoppingRequestStatus } from '../shopping-request.entity';

export class CreateShoppingRequestDto {
  @IsString()
  user_id: string;

  @IsString()
  request_code: string;

  @IsString()
  courier_id: string;

  @IsOptional()
  @IsNumber()
  items_count?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  status?: ShoppingRequestStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  payment_slips?: string[];
}
