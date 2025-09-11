import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsUUID,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';

export class CreateDocumentDto {
  @ApiProperty({ enum: FeatureType })
  @IsEnum(FeatureType)
  feature_type: FeatureType;

  @ApiProperty({ description: 'Feature foreign key ID' })
  @IsUUID()
  feature_fid: string;

  @ApiProperty({ description: 'User ID who uploaded the document' })
  @IsUUID()
  uploaded_by: string;

  @ApiProperty()
  @IsString()
  document_name: string;

  @ApiProperty()
  @IsString()
  original_filename: string;

  @ApiProperty()
  @IsString()
  document_url: string;

  @ApiProperty()
  @IsString()
  document_type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  file_size?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  mime_type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_required?: boolean;
}
