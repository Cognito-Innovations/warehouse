'use client';

import { Paper, Typography, Box, Chip } from '@mui/material';
import { formatDateTime } from '@/lib/utils';

interface RequestDetailsProps {
  details: any;
}

export default function RequestDetails({ details }: RequestDetailsProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 2.5,
        borderRadius: 2,
        border: '1px solid #E0E0E0',
        backgroundColor: '#fff',
      }}
    >
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', mb: 1 }}>
        <Box>
          <Typography variant="body2">{details.request_no || `PR/IN/${details.id}`}</Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatDateTime(details.created_at)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Request From
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {details.country || 'India'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Supplier
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {details.supplier_name}
          </Typography>
        </Box>
    </Box>

    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Supplier Contact
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {details.supplier_phone} / {details.alt_phone || 'null'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            No. of Box/PCS
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {details.pcs_box || '—'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Est Weight
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {details.est_weight ? `${details.est_weight}kg` : '—'}
          </Typography>
        </Box>
    </Box>

    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Pickup Location
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        {details.pickup_address}
      </Typography>
    </Box>
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Package Details
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        {details.pkg_details}
      </Typography>
    </Box>

    <Box>
      <Typography variant="body2" color="text.secondary">
        Status
      </Typography>
      <Chip
        label={details.status}
        sx={{
          mt: 0.5,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          backgroundColor:
            details.status === 'REQUESTED'
              ? '#FF9800'
              : details.status === 'QUOTED' || 'PICKED'
              ? '#4CAF50'
              : details.status === 'CANCELLED'
              ? '#EF4444'
              : '#9E9E9E',
          color: '#fff',
        }}
      />
    </Box>
    </Paper>
  );
}