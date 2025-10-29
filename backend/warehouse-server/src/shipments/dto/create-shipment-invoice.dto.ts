import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChargeDto {
  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  total: number;
}

export class CreateShipmentInvoiceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChargeDto)
  charges: ChargeDto[];

  @IsNumber()
  total: number;
}
