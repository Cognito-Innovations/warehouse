import { Card, Typography } from '@mui/material';
import TrackingItem from './TrackingItem';
import { STATUS_HANDLERS } from '../../../utils/trackingHandlers';

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

const TrackingStatus = ({ details }) => {
  const normalizedStatus = details.status.replace(/_/g, ' ').toLowerCase();
  const statusToMatch = details.status === 'QUOTED' ? 'Quotation Ready'.toLowerCase() : normalizedStatus;

  const currentStatusIndex = TRACKING_STEPS.findIndex(
    step => step.label.toLowerCase() === statusToMatch
  );

  return (
  <Card sx={{ p: 3 }}>
    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
      Tracking
    </Typography>

    {TRACKING_STEPS.map((step, index) => {
      const isCompleted = currentStatusIndex >= 0 && index <= currentStatusIndex;
                  
      const { description, date } =
        STATUS_HANDLERS[step.label]?.(details, step) ?? {
          description: step.defaultDescription,
        };

      return (
        <TrackingItem
          key={step.label}
          status={step.label}
          description={description}
          createdAt={date}
          completed={isCompleted}
          isLast={index === TRACKING_STEPS.length - 1}
        />
      );
    })}
  </Card>
  )
};

export default TrackingStatus;