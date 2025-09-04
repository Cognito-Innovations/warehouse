import React, { useEffect, useState } from 'react';
import { Box} from '@mui/material';
import { useParams } from 'react-router-dom';

import TopNavbar from '../components/Layout/TopNavbar';
import RequestDetailHeader from '../components/PickupRequests/Detail/RequestDetailHeader.tsx';
import RequestDetailContent from '../components/PickupRequests/Detail/RequestDetailContent.tsx';
import { getPickupRequestById } from '../services/api.services.ts';

const PickupRequestDetail: React.FC = () => {
  const { id } = useParams();
  const [pickupRequest, setPickupRequest] = useState(null);

  const fetchRequest = async () => {
    if (!id) return;
    try {
      const data = await getPickupRequestById(id);
      setPickupRequest(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (!pickupRequest) return <div>Loading...</div>;

  return (
    <Box>
      <TopNavbar pageTitle="Pickup Request" pageSubtitle="All" />
      <RequestDetailHeader request={pickupRequest} onStatusUpdate={fetchRequest} />
      <RequestDetailContent request={pickupRequest} />
    </Box>
  );
};

export default PickupRequestDetail;