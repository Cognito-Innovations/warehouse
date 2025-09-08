import { IsEnum, IsOptional } from 'class-validator';
import { TrackingStatus } from '../tracking-request.entity';

export class UpdateTrackingRequestDto {
  @IsOptional()
  @IsEnum(TrackingStatus)
  status?: TrackingStatus;
}
