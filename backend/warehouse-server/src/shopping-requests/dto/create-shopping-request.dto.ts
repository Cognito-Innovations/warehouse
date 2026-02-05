import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateShoppingRequestDto {
  @IsString()
  user_id: string;

  @IsOptional()
  @IsNumber()
  items_count?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
