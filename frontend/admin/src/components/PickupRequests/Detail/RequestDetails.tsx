import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface DetailItemProps {
  label: string;
  value: string | number;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: 'block', mb: 0.5 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
      {value}
    </Typography>
  </Box>
);

interface PickupDetails {
  pickup_address: string;
  supplier_name: string;
  supplier_phone: string;
  pcs_box: number;
  est_weight: string;
  pkg_details: string;
}

interface RequestDetailsProps {
  details: PickupDetails;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ details }) => (
  <>
    <Typography variant="subtitle1" fontWeight={500} mb={3}>
      Pickup Request Details
    </Typography>

    <Paper
      elevation={0}
      sx={{
        width: '100%',
        minWidth: '650px',
        p: 3,
        borderRadius: 2,
        border: '1px solid #E0E0E0',
        backgroundColor: '#fff',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2.5,
        }}
      >
        <Box sx={{ gridColumn: '1 / -1' }}>
          <DetailItem label="Pickup Location" value={details.pickup_address} />
        </Box>

        <DetailItem label="Supplier" value={details.supplier_name} />
        <DetailItem label="Supplier Contact" value={details.supplier_phone} />
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