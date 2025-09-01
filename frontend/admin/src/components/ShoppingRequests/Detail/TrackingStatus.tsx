import { Card, Typography } from '@mui/material';
import TrackingItem from './TrackingItem';

const TrackingStatus = ({ tracking }: { tracking: any[] }) => (
  <Card sx={{ p: 3 }}>
    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
      Tracking
    </Typography>
    {tracking.map((item, index) => (
      <TrackingItem
        key={index}
        {...item}
        isLast={index === tracking.length - 1}
      />
    ))}
  </Card>
);

export default TrackingStatus;