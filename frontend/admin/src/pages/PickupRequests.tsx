import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import RequestSummary from '../components/PickupRequests/RequestSummary';
import RequestTable from '../components/PickupRequests/RequestTable';
import { getPickupRequests } from '../services/api.services';

const PickupRequests: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const requests = await getPickupRequests();
      setRequests(requests)
    } catch (error) {
      console.error("Failed to fetch pickup requests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests()
  }, []);

  return (
    <Box>
      <TopNavbar pageTitle="Pickup Request" pageSubtitle="All" />
      <RequestSummary requests={requests} loading={loading} />
      <RequestTable requests={requests} loading={loading} />
    </Box>
  );
};

export default PickupRequests;