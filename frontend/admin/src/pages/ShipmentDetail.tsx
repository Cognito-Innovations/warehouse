import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import TopNavbar from '../components/Layout/TopNavbar';
import RequestDetailHeader from '../components/ShoppingRequests/Detail/RequestDetailHeader.tsx';
import RequestDetailContent from '../components/ShoppingRequests/Detail/RequestDetailContent.tsx';
import { getShoppingRequestByCode } from '../services/api.services.ts';

const ShipmentDetail: React.FC = () => {
  const { id } = useParams();
  const [shoppingRequest, setShoppingRequest] = useState<any | null>(null);

  const fetchRequest = async () => {
    if (!id) return;
    try {
      const data = await getShoppingRequestByCode(id);
      setShoppingRequest(data);
    } catch (err) {
      console.error("Error fetching shopping request:", err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (!shoppingRequest) return <div>Loading...</div>;

  return (
    <Box>
      <TopNavbar pageTitle="Shipment Request" pageSubtitle="All" />
      <RequestDetailHeader request={shoppingRequest} onStatusUpdated={fetchRequest}/>
      <RequestDetailContent request={shoppingRequest} onStatusUpdated={fetchRequest} />
    </Box>
  );
};

export default ShipmentDetail;