import { Grid } from '@mui/material';
import CustomerInfo from './CustomerInfo';
import ItemsTable from './ItemsTable';
import TrackingStatus from './TrackingStatus';
import ActionLogs from './ActionLogs';
import PaymentSlipsCard from './PaymentSlipsCard';

interface RequestData {
  details: any; 
  status: string;
  payment_slips?: string[];
  onStatusUpdated?: () => void;
}

const RequestDetailContent: React.FC<{ request: RequestData }> = ({ request, onStatusUpdated }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} lg={8}>
      <CustomerInfo details={request} />

      {(request.status === "PAYMENT_PENDING" || request.status === "PAYMENT_APPROVED") && (
        <PaymentSlipsCard details={request || []} onStatusUpdated={onStatusUpdated} />
      )}

      <ItemsTable details={request} />
    </Grid>

    <Grid item xs={12} lg={4}>
      <TrackingStatus details={request} />
      <ActionLogs />
    </Grid>
  </Grid>
);

export default RequestDetailContent;