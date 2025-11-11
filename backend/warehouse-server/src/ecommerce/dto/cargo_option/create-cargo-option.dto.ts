import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEcommerceCargoOptionDto {
  @IsString()
  @IsNotEmpty()
  label: string;
}
