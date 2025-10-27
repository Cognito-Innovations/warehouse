import { IsNumber } from 'class-validator';

export class UpdateShipmentDto {
  @IsNumber()
  weight: number;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}
