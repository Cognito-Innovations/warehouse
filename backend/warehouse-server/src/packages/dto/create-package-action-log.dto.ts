import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreatePackageActionLogDto {
  @IsString()
  package_id: string;

  @IsString()
  file_name: string;

  @IsString()
  file_url: string;

  @IsString()
  file_type: string;

  @IsNumber()
  file_size: number;

  @IsString()
  mime_type: string;

  @IsString()
  uploaded_by: string;

  @IsOptional()
  @IsBoolean()
  is_completed?: boolean;

  @IsOptional()
  uploaded_at?: Date;
}
