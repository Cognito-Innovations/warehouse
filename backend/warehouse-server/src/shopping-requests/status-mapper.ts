import { ShoppingRequestStatus } from './shopping-request.entity';
import { TrackingStatus } from 'src/tracking-requests/tracking-request.entity';

export function mapToTrackingStatus(
  status: ShoppingRequestStatus,
): TrackingStatus {
  switch (status) {
    case ShoppingRequestStatus.REQUESTED:
      return TrackingStatus.Requested;
    case ShoppingRequestStatus.QUOTATION_READY:
      return TrackingStatus.Quoted;
    case ShoppingRequestStatus.QUOTATION_CONFIRMED:
      return TrackingStatus.QuotationConfirmed;
    case ShoppingRequestStatus.INVOICED:
      return TrackingStatus.Invoiced;
    case ShoppingRequestStatus.PAYMENT_PENDING:
      return TrackingStatus.PaymentPending;
    case ShoppingRequestStatus.PAYMENT_APPROVED:
      return TrackingStatus.PaymentApproved;
    case ShoppingRequestStatus.ORDER_PLACED:
      return TrackingStatus.OrderPlaced;
    case ShoppingRequestStatus.REJECTED:
      return TrackingStatus.Rejected;
    default:
      return TrackingStatus.Requested;
  }
}
