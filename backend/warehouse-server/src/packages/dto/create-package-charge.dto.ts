import { IsNumber, IsString } from 'class-validator';

export class CreatePackageChargeDto {
  @IsString()
  package_id: string;

  @IsNumber()
  amount: number;
}
