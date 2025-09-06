import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateShoppingRequestDto {
  @IsString()
  user_id: string;

  @IsString()
  request_code: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsNumber()
  items?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  payment_slips?: string[];
}
