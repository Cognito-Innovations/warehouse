import React from 'react';
import { Grid } from '@mui/material';
import RequestDetails from './RequestDetails';
import TrackingStatus from './TrackingStatus';
import { type TrackingHistoryItem } from './TrackingItem';

interface RequestData {
  details: any; 
  status: string;
  trackingHistory: TrackingHistoryItem[];
}

const RequestDetailContent: React.FC<{ request: RequestData }> = ({ request }) => (
  <Grid container spacing={3} mt={3}>
    <Grid item xs={12} lg={8}>
      <RequestDetails details={request} />
    </Grid>
    
    <Grid item xs={12} lg={4}>
      <TrackingStatus details={request} />
    </Grid>
  </Grid>
);

export default RequestDetailContent;