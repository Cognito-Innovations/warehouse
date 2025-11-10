import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class UpdateEcommerceProductDto {
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsUUID()
  @IsOptional()
  sub_category_id?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  country_ids?: string[];
}
