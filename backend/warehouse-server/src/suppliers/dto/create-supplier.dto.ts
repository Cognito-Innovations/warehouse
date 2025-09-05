import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  supplier_name: string;
}
