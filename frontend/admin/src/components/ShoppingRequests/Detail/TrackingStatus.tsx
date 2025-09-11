import { Card, Typography } from '@mui/material';
import TrackingItem from './TrackingItem';

const TRACKING_STEPS = [
  { label: 'Requested', defaultDescription: 'Requested by User' },
  { label: 'Quotation Ready', defaultDescription: 'Quotation is not ready yet!' },
  { label: 'Quotation Confirmed', defaultDescription: 'Quotation is not confirmed yet!' },
  { label: 'Invoiced', defaultDescription: 'Waiting for confirmation!' },
  { label: 'Pending Payment Approval', defaultDescription: 'Waiting for confirmation!' },
  { label: 'Confirmed', defaultDescription: 'Waiting for upload payment slip' },
  { label: 'Payment Approved', defaultDescription: 'Waiting for payment approval' },
  { label: 'Order placed', defaultDescription: 'Waiting for complete' },
];

const STATUS_MAPPING: Record<string, string> = {
  REQUESTED: 'Requested',
  QUOTED: 'Quotation Ready',
  QUOTATION_CONFIRMED: 'Quotation Confirmed',
  INVOICED: 'Invoiced',
  PAYMENT_PENDING: 'Pending Payment Approval',
  PAYMENT_APPROVED: 'Payment Approved',
  ORDER_PLACED: 'Order Placed',
};

const TrackingStatus = ({ details }) => {
  const trackingHistory = details.tracking_requests || [];

  return (
  <Card sx={{ p: 3 }}>
    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
      Tracking
    </Typography>

    {TRACKING_STEPS.map((step, index) => {
      const historyItem = trackingHistory.find(
        (track) =>
          STATUS_MAPPING[track.status.toUpperCase()]?.toLowerCase() ===
          step.label.toLowerCase()
      );

      const fallbackItem =
        step.label === 'Quotation Confirmed'
          ? trackingHistory.find((track) => track.status.toUpperCase() === 'INVOICED')
        : step.label === 'Confirmed'
          ? trackingHistory.find((track) => track.status.toUpperCase() === 'PAYMENT_PENDING')
        : undefined;
      
      const effectiveItem = historyItem || fallbackItem;    
      const isCompleted = Boolean(effectiveItem);

      return (
        <TrackingItem
          key={step.label}
          status={step.label}
          description={
              effectiveItem
                ? `Status updated to ${step.label}`
                : step.defaultDescription
            }
          createdAt={effectiveItem?.created_at}
          completed={isCompleted}
          isLast={index === TRACKING_STEPS.length - 1}
        />
      );
    })}
  </Card>
  )
};

export default TrackingStatus;