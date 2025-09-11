import { ApiProperty } from '@nestjs/swagger';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';
import { User } from 'src/users/user.entity';

export class DocumentSummaryDto {
  id: string;
  document_name: string;
  document_url: string;
  category?: string;
}

export class DocumentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uploaded_by: User;

  @ApiProperty({ enum: FeatureType })
  feature_type: FeatureType;

  @ApiProperty()
  feature_fid: string;

  @ApiProperty()
  document_name: string;

  @ApiProperty()
  original_filename: string;

  @ApiProperty()
  document_url: string;

  @ApiProperty()
  document_type: string;

  @ApiProperty()
  file_size?: number;

  @ApiProperty()
  mime_type?: string;

  @ApiProperty()
  category?: string;

  @ApiProperty()
  is_required: boolean;

  @ApiProperty()
  created_at: number;

  @ApiProperty()
  updated_at: number;
}
