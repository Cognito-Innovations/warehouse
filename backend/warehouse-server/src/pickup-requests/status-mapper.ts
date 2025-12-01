import { PickupRequestStatus } from './pickup-request.entity';
import { TrackingStatus } from '../tracking-requests/tracking-request.entity';

const PICKUP_TO_TRACKING_MAP: Record<PickupRequestStatus, TrackingStatus> = {
  [PickupRequestStatus.Requested]: TrackingStatus.Requested,
  [PickupRequestStatus.Quoted]: TrackingStatus.Quoted,
  [PickupRequestStatus.Confirmed]: TrackingStatus.Confirmed,
  [PickupRequestStatus.Picked]: TrackingStatus.Picked,
  [PickupRequestStatus.Cancelled]: TrackingStatus.Cancelled,
};

export const mapPickupToTrackingStatus = (
  status: PickupRequestStatus,
): TrackingStatus => {
  return PICKUP_TO_TRACKING_MAP[status] ?? TrackingStatus.Requested;
};
