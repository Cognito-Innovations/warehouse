import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface DetailItemProps {
  label: string;
  value: string | number;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ 
        display: 'block', 
        mb: 0.75,
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.025em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        whiteSpace: 'pre-wrap',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'text.primary',
        lineHeight: 1.5,
      }}
    >
      {value || "-"}
    </Typography>
  </Box>
);

interface PickupDetails {
  pickup_address: string;
  supplier_name: string;
  supplier_phone_number: string;
  pcs_box: number;
  est_weight: string;
  pkg_details: string;
}

interface RequestDetailsProps {
  details: PickupDetails;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ details }) => (
  <>
    <Typography 
      variant="h6" 
      sx={{ 
        fontWeight: 700,
        mb: 3,
        fontSize: '1.25rem',
        color: 'text.primary',
        letterSpacing: '0.025em',
      }}
    >
      Pickup Request Details
    </Typography>

    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: 4,
        borderRadius: 2.5,
        border: '1px solid rgba(0,0,0,0.06)',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
        }}
      >
        <Box sx={{ gridColumn: '1 / -1' }}>
          <DetailItem label="Pickup Location" value={details.pickup_address} />
        </Box>

        <DetailItem label="Supplier" value={details.supplier_name} />
        <DetailItem label="Supplier Contact" value={details.supplier_phone_number} />
        <DetailItem label="No. of PCS" value={details.pcs_box} />
        <DetailItem label="Est. Weight" value={details.est_weight} />

        <Box sx={{ gridColumn: '1 / -1' }}>
          <DetailItem label="Package Details" value={details.pkg_details} />
        </Box>
      </Box>
    </Paper>
  </>
);

export default RequestDetails;