import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FeatureType, TrackingStatus } from '../tracking-request.entity';
import { Role } from 'src/users/user.entity';

export class CreateTrackingRequestDto {
  @ApiProperty({
    description: 'User ID who owns the tracked item',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  user: string;

  @ApiProperty({
    description: 'Type of feature being tracked',
    enum: FeatureType,
    example: FeatureType.PickupRequest,
  })
  @IsEnum(FeatureType)
  feature_type: FeatureType;

  @IsEnum(Role)
  role?: Role;

  //TODO: Why is it optional ?
  @ApiProperty({
    description: 'Courier ID that is being tracked',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  courier_id?: string;

  @ApiProperty({
    description: 'Current status of the tracking request',
    enum: TrackingStatus,
    example: TrackingStatus.Requested,
  })
  @IsEnum(TrackingStatus)
  status: TrackingStatus;

  @ApiProperty({
    description: 'Feature ID that is being tracked',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsString()
  feature_fid: string;
}
