import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";

export class ProductResponseDto {
  @IsUUID()
  id: string;
  
  @IsString()
  shopping_request_id: string;

  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  unit_price?: number;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
  
  @IsDate()
  @IsOptional()
  created_at: Date;
  
  @IsDate()
  @IsOptional()
  updated_at: Date;
}
