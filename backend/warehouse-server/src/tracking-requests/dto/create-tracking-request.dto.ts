import {
  IsEnum,
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { FeatureType, Status } from '../tracking-request.entity';

export class CreateTrackingRequestDto {
  @IsUUID()
  admin: string;

  @IsUUID()
  user: string;

  @IsEnum(FeatureType)
  feature_type: FeatureType;

  @IsEnum(Status)
  status: Status;

  @IsString()
  feature_fid: string;

  @IsOptional()
  @IsNumber()
  count?: number;
}
