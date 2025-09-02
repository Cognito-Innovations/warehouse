import React from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import RequestSummary from '../components/ShoppingRequests/RequestSummary';
import RequestTable from '../components/ShoppingRequests/RequestTable';

const ShoppingRequests: React.FC = () => {
  return (
    <Box>
      <TopNavbar pageTitle="Shopping Request" pageSubtitle="/ All" />
      <RequestSummary />
      <RequestTable />
    </Box>
  );
};

export default ShoppingRequests;