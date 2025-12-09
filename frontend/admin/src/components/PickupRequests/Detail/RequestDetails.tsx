import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface DetailItemProps {
  label: string;
  value: string | number | undefined;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Box>
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

export interface RequestDetailsData {
  status: string;
  pickup_address: string;
  supplier_name: string;
  supplier_phone_number: string;
  pcs_box: number;
  est_weight: string;
  pkg_details: string;
  price?: string;
  total_mvr?: string;
  remarks?: string;
}

interface RequestDetailsProps {
  details: RequestDetailsData;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ details }) => {
  if (!details) return null;
  
  const showQuotationDetails = details.status !== 'REQUESTED';

  const total = details.price && details.pcs_box
    ? Number(details.price) * Number(details.pcs_box)
    : 0;

  return (
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
          p: { xs: 1.5, sm: 2, md: 2.5 },
          borderRadius: 2.5,
          border: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            rowGap: { xs: 3, sm: 3.5 },
            columnGap: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ gridColumn: '1 / -1' }}>
            <DetailItem label="Pickup Location" value={details.pickup_address} />
          </Box>

          <DetailItem label="Supplier" value={details.supplier_name} />
          <DetailItem label="Supplier Contact" value={details.supplier_phone_number} />

          <DetailItem label="No. of PCS" value={details.pcs_box} />
          <DetailItem label="Est. Weight" value={details.est_weight} />

          {showQuotationDetails && (
            <>
              {details.price && (<DetailItem label="Total ($)" value={`$${total.toFixed(2)}`} />)}
              {details.total_mvr && (<DetailItem label="Total (MVR)" value={`${details.total_mvr}`}/> )}
            </>
          )}

          <Box sx={{ gridColumn: '1 / -1' }}>
            <DetailItem label="Package Details" value={details.pkg_details} />
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            {showQuotationDetails && (
                <DetailItem label="Customer Remarks" value={details.remarks} />
            )}
          </Box>
        </Box>
      </Paper>
    </>
  );
}

export default RequestDetails;