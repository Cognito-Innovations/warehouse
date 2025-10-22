import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEcommerceMeasurementDto {
  @IsString()
  @IsNotEmpty()
  label: string;
}
