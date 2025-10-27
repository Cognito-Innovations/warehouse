import { ShipmentStatus } from './shipment.entity';
import { TrackingStatus } from 'src/tracking-requests/tracking-request.entity';

export function mapToTrackingStatus(status: ShipmentStatus): TrackingStatus {
  switch (status) {
    case ShipmentStatus.SHIP_REQUEST: 
      return TrackingStatus.ShipRequest;
    case ShipmentStatus.PAYMENT_PENDING:
      return TrackingStatus.PaymentPending;
    case ShipmentStatus.PAYMENT_APPROVED:
      return TrackingStatus.PaymentApproved;
    case ShipmentStatus.READY_TO_SHIP:
      return TrackingStatus.ReadyToShip;
    case ShipmentStatus.DEPARTED:
      return TrackingStatus.Departed;
    case ShipmentStatus.DISCARDED:
      return TrackingStatus.Discarded;
    default:
      return TrackingStatus.Requested;
  }
}
