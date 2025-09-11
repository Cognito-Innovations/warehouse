import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import TopNavbar from '../components/Layout/TopNavbar';
import RequestDetailContent from '../components/ShoppingRequests/Detail/RequestDetailContent.tsx';
import { getShoppingRequestByCode } from '../services/api.services.ts';
import RequestDetailCard from '../components/ShoppingRequests/Detail/RequestDetailCard.tsx';

const ShoppingRequestDetail: React.FC = () => {
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
      <TopNavbar pageTitle="Shopping Request" pageSubtitle="All" />
      <RequestDetailCard request={shoppingRequest} onStatusUpdated={fetchRequest}/>
      <RequestDetailContent request={shoppingRequest} onStatusUpdated={fetchRequest} />
    </Box>
  );
};

export default ShoppingRequestDetail;