import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeatureType, Status } from '../tracking-request.entity';
import { User } from '../../users/user.entity';

export class TrackingRequestResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the tracking request',
    example: '123e4567-e89b-12d3-a456-426614174000',
    additionalProperties: true,
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Admin user managing the tracking request',
    type: 'object',
    additionalProperties: true,
  })
  admin?: User;

  @ApiPropertyOptional({
    description: 'User who owns the tracked item',
    type: 'object',
    additionalProperties: true,
  })
  user?: User;

  @ApiProperty({
    description: 'Type of feature being tracked',
    enum: FeatureType,
    example: FeatureType.PickupRequest,
  })
  feature_type: FeatureType;

  @ApiProperty({
    description: 'Current status of the tracking request',
    enum: Status,
    example: Status.Requested,
  })
  status: Status;

  @ApiProperty({
    description: 'Feature ID that is being tracked',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  feature_fid: string;

  @ApiProperty({
    description: 'Count or quantity being tracked',
    example: 1,
  })
  count: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T14:45:00Z',
  })
  updated_at: Date;
}
