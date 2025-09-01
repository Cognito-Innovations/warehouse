import { Grid } from '@mui/material';
import CustomerInfo from './CustomerInfo';
import ItemsTable from './ItemsTable';
import TrackingStatus from './TrackingStatus';
import ActionLogs from './ActionLogs';

const RequestDetailContent = ({ requestDetail }: { requestDetail: any }) => (
  <Grid container spacing={3}>
    <Grid spacing={{ xs: 12, lg: 8 }} >
      <CustomerInfo customer={requestDetail.customer} remarks={requestDetail.remarks} />
      <ItemsTable items={requestDetail.items} summary={requestDetail.summary} />
    </Grid>
    <Grid spacing={{ xs: 12, lg: 4 }} >
      <TrackingStatus tracking={requestDetail.tracking} />
      <ActionLogs logs={requestDetail.actionLogs} />
    </Grid>
  </Grid>
);

export default RequestDetailContent;