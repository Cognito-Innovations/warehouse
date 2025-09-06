import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRackDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  count: number;
}
