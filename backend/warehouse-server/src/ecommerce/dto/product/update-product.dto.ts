import { IsOptional, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsUUID()
  @IsOptional()
  sub_category_id?: string;

  @IsUUID()
  @IsOptional()
  country_id?: string;
}
