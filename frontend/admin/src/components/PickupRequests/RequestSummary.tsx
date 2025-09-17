import React, { useMemo } from 'react';
import { Box, Card, Skeleton } from '@mui/material';
import { SummaryCard } from './SummaryCard';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';

interface RequestSummaryProps {
  requests: any[];
  loading: boolean;
}

const RequestSummary: React.FC<RequestSummaryProps> = ({ requests, loading }) => {
  const summaryCounts = useMemo(() => {
    return requests.reduce((acc, req) => {
      if (req.status === 'REQUESTED' || req.status === 'ACCEPTED') {
        acc.pendingAccepted += 1;
      } else if (req.status === 'QUOTATION CONFIRMED') {
        acc.confirmed += 1;
      } else if (req.status === 'PICKED') {
        acc.picked += 1;
      }
      return acc;
    }, { pendingAccepted: 0, confirmed: 0, picked: 0 })
  }, [requests]);

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {[...Array(3)].map((_, index) => (
            <Card key={index} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2.5 }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="30%" height={40} />
              </Box>
              <Skeleton variant="circular" width={48} height={48} />
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2.5,
        }}
      >
        <SummaryCard
          title="Pending Accepted"
          value={String(summaryCounts.pendingAccepted)}
          icon={<ShoppingBagOutlinedIcon />}
          bgColor="#F87171"
        />
        <SummaryCard
          title="Quotation Confirmed"
          value={String(summaryCounts.pendingAccepted)}
          icon={<RedeemOutlinedIcon />}
          bgColor="#EC4899"
        />
        <SummaryCard
          title="Payment Pending"
          value={String(summaryCounts.pendingAccepted)}
          icon={<FlightTakeoffOutlinedIcon />}
          bgColor="#6366F1"
        />
      </Box>
    </Box>
  );
};

export default RequestSummary;