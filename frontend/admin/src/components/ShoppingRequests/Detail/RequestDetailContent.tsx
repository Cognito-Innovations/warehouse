import { Grid } from '@mui/material';
import CustomerInfo from './CustomerInfo';
import ItemsTable from './ItemsTable';
import TrackingStatus from './TrackingStatus';
import ActionLogs from './ActionLogs';

interface RequestData {
  details: any; 
  status: string;
  // trackingHistory: TrackingHistoryItem[];
}

const RequestDetailContent: React.FC<{ request: RequestData }> = ({ request }) => (
  <Grid container spacing={3}>
    <Grid spacing={{ xs: 12, lg: 8 }} >
      <CustomerInfo details={request}/>
      <ItemsTable details={request} />
    </Grid>

    <Grid spacing={{ xs: 12, lg: 4 }} >
      <TrackingStatus details={request} />
      <ActionLogs logs={requestAnimationFrame.logs || ""} />
    </Grid>
  </Grid>
);

export default RequestDetailContent;