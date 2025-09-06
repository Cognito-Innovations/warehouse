import { FeatureType, Status } from '../tracking-request.entity';
import { User } from '../../users/user.entity';

export class TrackingRequestResponseDto {
  id: string;
  admin?: User;
  user?: User;
  feature_type: FeatureType;
  status: Status;
  feature_fid: string;
  count: number;
  created_at: Date;
  updated_at: Date;
}
