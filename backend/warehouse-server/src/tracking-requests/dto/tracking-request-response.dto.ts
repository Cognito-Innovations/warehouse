import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrackingStatus } from '../tracking-request.entity';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class TrackingRequestResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the tracking request',
    example: '123e4567-e89b-12d3-a456-426614174000',
    additionalProperties: true,
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Courier that is being tracked',
    type: 'object',
    additionalProperties: true,
  })
  courier?: CourierCompany;

  @ApiPropertyOptional({
    description: 'User who owns the tracked item',
    type: 'object',
    additionalProperties: true,
  })
  user?: UserResponseDto;

  // @ApiProperty({
  //   description: 'Type of feature being tracked',
  //   enum: FeatureType,
  //   example: FeatureType.PickupRequest,
  // })
  // feature_type: FeatureType;

  @ApiProperty({
    description: 'Current status of the tracking request',
    enum: TrackingStatus,
    example: TrackingStatus.Requested,
  })
  status: TrackingStatus;

  // @ApiProperty({
  //   description: 'Feature ID that is being tracked',
  //   example: '123e4567-e89b-12d3-a456-426614174002',
  // })
  // feature_fid: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: number;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T14:45:00Z',
  })
  updated_at: number;
}
