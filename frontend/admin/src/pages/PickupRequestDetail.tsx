import React, { useEffect, useState } from 'react';
import { Box, CircularProgress} from '@mui/material';
import { useParams } from 'react-router-dom';

import TopNavbar from '../components/Layout/TopNavbar';
import RequestDetailHeader from '../components/PickupRequests/Detail/RequestDetailHeader.tsx';
import RequestDetailContent from '../components/PickupRequests/Detail/RequestDetailContent.tsx';
import { getPickupRequestById } from '../services/api.services.ts';

const PickupRequestDetail: React.FC = () => {
  const { id } = useParams();
  const [pickupRequest, setPickupRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequest = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getPickupRequestById(id);

      setPickupRequest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 1 }}>
        <TopNavbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <TopNavbar pageTitle="Pickup Request" pageSubtitle="All" />
      <RequestDetailHeader request={pickupRequest} onStatusUpdate={fetchRequest} />
      <RequestDetailContent request={pickupRequest} />
    </Box>
  );
};

export default PickupRequestDetail;