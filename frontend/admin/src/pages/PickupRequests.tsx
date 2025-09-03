import React from 'react';
import { Box } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import RequestSummary from '../components/PickupRequests/RequestSummary';
import RequestTable from '../components/PickupRequests/RequestTable';

const PickupRequests: React.FC = () => {
  return (
    <Box>
      <TopNavbar pageTitle="Pickup Request" pageSubtitle="All" />
      <RequestSummary />
      <RequestTable />
    </Box>
  );
};

export default PickupRequests;