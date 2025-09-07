import {
  IsEnum,
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeatureType, Status } from '../tracking-request.entity';

export class CreateTrackingRequestDto {
  @ApiProperty({
    description: 'Admin user ID who is managing the tracking request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  admin: string;

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

  @ApiProperty({
    description: 'Current status of the tracking request',
    enum: Status,
    example: Status.Requested,
  })
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    description: 'Feature ID that is being tracked',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsString()
  feature_fid: string;

  @ApiPropertyOptional({
    description: 'Count or quantity being tracked',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  count?: number;
}
