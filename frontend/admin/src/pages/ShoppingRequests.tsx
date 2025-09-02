import React from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import RequestSummary from '../components/ShoppingRequests/RequestSummary';
import RequestTable from '../components/ShoppingRequests/RequestTable';

interface ShoppingRequestsProps {
  onToggleSidebar: () => void;
}

const ShoppingRequests: React.FC<ShoppingRequestsProps> = ({ onToggleSidebar }) => {
  return (
    <Box>
      <TopNavbar title="Shopping Request" onToggleSidebar={onToggleSidebar} />
      <RequestSummary />
      <RequestTable />
    </Box>
  );
};

export default ShoppingRequests;