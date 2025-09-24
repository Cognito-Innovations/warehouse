import { PickupRequestStatus } from './pickup-request.entity';
import { TrackingStatus } from '../tracking-requests/tracking-request.entity';

export const mapPickupToTrackingStatus = (
  status: PickupRequestStatus
): TrackingStatus => {
  switch (status) {
    case PickupRequestStatus.Requested:
      return TrackingStatus.Requested;

    case PickupRequestStatus.Quoted:
      return TrackingStatus.Quoted;

    case PickupRequestStatus.Confirmed:
      return TrackingStatus.Confirmed; 

    case PickupRequestStatus.Picked:
      return TrackingStatus.Picked;

    case PickupRequestStatus.Cancelled:
      return TrackingStatus.Cancelled;

    default:
      return TrackingStatus.Requested;
  }
};