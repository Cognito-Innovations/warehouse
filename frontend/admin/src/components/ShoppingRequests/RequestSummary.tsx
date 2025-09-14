import React from 'react';
import { Box, Card, Typography, Avatar } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';

const SummaryCard = ({
  title,
  value,
  icon,
  bgColor,
}: {
  title: string;
  value: string;
  icon: React.ReactElement;
  bgColor: string;
}) => (
  <Card
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 2.5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <Box sx={{ flex: 1 }}>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 0.5,
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: '0.025em'
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          fontSize: '2rem',
          lineHeight: 1.2,
          color: 'text.primary'
        }}
      >
        {value}
      </Typography>
    </Box>
    <Avatar
      sx={{
        width: 48,
        height: 48,
        bgcolor: bgColor,
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        '& .MuiSvgIcon-root': {
          fontSize: '1.5rem',
        },
      }}
    >
      {icon}
    </Avatar>
  </Card>
);

const RequestSummary: React.FC = () => {
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
          value="3"
          icon={<ShoppingBagOutlinedIcon />}
          bgColor="#F87171"
        />
        <SummaryCard
          title="Quotation Confirmed"
          value="0"
          icon={<RedeemOutlinedIcon />}
          bgColor="#EC4899"
        />
        <SummaryCard
          title="Payment Pending"
          value="0"
          icon={<FlightTakeoffOutlinedIcon />}
          bgColor="#6366F1"
        />
      </Box>
    </Box>
  );
};

export default RequestSummary;