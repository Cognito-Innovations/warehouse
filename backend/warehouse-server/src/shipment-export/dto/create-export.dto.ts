import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateExportDto {
  @IsString()
  export_code: string;

  @IsOptional()
  @IsString()
  mawb?: string;

  @IsNumber()
  boxes_count: number;

  @IsString()
  created_by: string;
}
