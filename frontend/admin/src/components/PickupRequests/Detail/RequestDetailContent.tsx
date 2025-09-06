import React from 'react';
import { Grid, Box } from '@mui/material';
import RequestDetails from './RequestDetails';
import TrackingStatus from './TrackingStatus';
import { type TrackingHistoryItem } from './TrackingItem';

interface RequestData {
  details: any; 
  status: string;
  trackingHistory: TrackingHistoryItem[];
}

const RequestDetailContent: React.FC<{ request: RequestData }> = ({ request }) => (
  <Box sx={{ p: 3, width: '100%' }}>
    <Grid container spacing={3} sx={{ alignItems: 'flex-start', width: '100%' }}>
      <Grid item xs={12} md={6}>
        <RequestDetails details={request} />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TrackingStatus details={request} />
      </Grid>
    </Grid>
  </Box>
);

export default RequestDetailContent;