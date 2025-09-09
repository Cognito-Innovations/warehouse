import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '../tracking-request.entity';

export class UpdateTrackingRequestDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
