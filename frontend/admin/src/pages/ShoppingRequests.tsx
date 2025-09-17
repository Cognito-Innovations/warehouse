import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import RequestSummary from '../components/ShoppingRequests/RequestSummary';
import RequestTable from '../components/ShoppingRequests/RequestTable';
import { getAllShoppingRequests } from '../services/api.services';

const ShoppingRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requests = await getAllShoppingRequests();
      setRequests(requests);
    } catch (error) {
      console.error("Error fetching shopping requests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Box>
      <TopNavbar pageTitle="Shopping Request" pageSubtitle="All" />
      <RequestSummary requests={requests} loading={loading} />
      <RequestTable requests={requests} loading={loading} />
    </Box>
  );
};

export default ShoppingRequests;