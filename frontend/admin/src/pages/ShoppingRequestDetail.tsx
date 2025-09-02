import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import TopNavbar from '../components/Layout/TopNavbar';
import RequestDetailHeader from '../components/ShoppingRequests/Detail/RequestDetailHeader.tsx';
import RequestDetailContent from '../components/ShoppingRequests/Detail/RequestDetailContent.tsx';
import { requestDetailData } from '../data/shoppingRequestDetail';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const ShoppingRequestDetail: React.FC = () => {
  const { id } = useParams();
  const requestDetail = requestDetailData;

  return (
    <Box>
      <TopNavbar pageTitle="Shopping Request" pageSubtitle="/ All" />
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ my: 2 }}>
        <Link underline="hover" color="inherit" href="/requests">
          Shopping Requests
        </Link>
        <Typography color="text.primary">{id}</Typography>
      </Breadcrumbs>
      <RequestDetailHeader request={requestDetail} />
      <RequestDetailContent requestDetail={requestDetail} />
    </Box>
  );
};

export default ShoppingRequestDetail;