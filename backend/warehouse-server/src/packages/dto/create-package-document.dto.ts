import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreatePackageDocumentDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  url: string;

  @IsNumber()
  @IsPositive()
  size: number;
}
