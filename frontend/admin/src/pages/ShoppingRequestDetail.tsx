import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import TopNavbar from '../components/Layout/TopNavbar';
import RequestDetailHeader from '../components/ShoppingRequests/Detail/RequestDetailHeader.tsx';
import RequestDetailContent from '../components/ShoppingRequests/Detail/RequestDetailContent.tsx';
import { requestDetailData } from '../data/shoppingRequestDetail';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface ShoppingRequestDetailProps {
  onToggleSidebar: () => void;
}

const ShoppingRequestDetail: React.FC<ShoppingRequestDetailProps> = ({ onToggleSidebar }) => {
  const { id } = useParams();
  const requestDetail = requestDetailData;

  return (
    <Box>
      <TopNavbar title="Shopping Request" onToggleSidebar={onToggleSidebar} />
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