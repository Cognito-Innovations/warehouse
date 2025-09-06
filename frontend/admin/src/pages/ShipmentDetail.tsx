import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
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
    <Box sx={{ width: '100%', minHeight: '100vh', padding: "16px" }}>
      <TopNavbar pageTitle="Shipment Request" pageSubtitle="All" />
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <RequestDetailHeader request={shoppingRequest} onStatusUpdated={fetchRequest}/>
        <RequestDetailContent request={shoppingRequest} onStatusUpdated={fetchRequest} />
      </Container>
    </Box>
  );
};

export default ShipmentDetail;