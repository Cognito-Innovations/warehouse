import React from 'react';
import { Box, Card, Grid, Typography, Avatar } from '@mui/material';
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
      p: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 2,
    }}
  >
    <Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={600}>
        {value}
      </Typography>
    </Box>
    <Avatar
      sx={{
        width: 40,
        height: 40,
        bgcolor: bgColor,
        color: '#fff',
      }}
    >
      {icon}
    </Avatar>
  </Card>
);

const RequestSummary: React.FC = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        <Grid spacing={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Pending Accepted"
            value="3"
            icon={<ShoppingBagOutlinedIcon />}
            bgColor="#F87171"
          />
        </Grid>
        <Grid spacing={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Quotation Confirmed"
            value="0"
            icon={<RedeemOutlinedIcon />}
            bgColor="#EC4899"
          />
        </Grid>
        <Grid spacing={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Payment Pending"
            value="0"
            icon={<FlightTakeoffOutlinedIcon />}
            bgColor="#6366F1"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RequestSummary;