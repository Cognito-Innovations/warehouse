import React from 'react';
import { Box } from '@mui/material';
import RequestDetails from './RequestDetails';
import TrackingStatus from './TrackingStatus';

interface RequestData {
  details: any; 
  status: string;
  trackingHistory: any[];
}

const RequestDetailContent: React.FC<{ request: RequestData }> = ({ request }) => (
  <Box sx={{ p: 3, width: '100%' }}>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' },
        gap: 3,
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      <Box>
        <RequestDetails details={request} />
      </Box>
      
      <Box>
        <TrackingStatus details={request} />
      </Box>
    </Box>
  </Box>
);

export default RequestDetailContent;