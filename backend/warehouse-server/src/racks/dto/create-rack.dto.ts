import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRackDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
