import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

import type { PreArrival } from '../../types/PreArrival';

interface ReceiveModalContentProps {
  selectedItem: PreArrival;
}

const ReceiveModalContent: React.FC<ReceiveModalContentProps> = ({ selectedItem }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7280', fontSize: '0.875rem', fontWeight: 600 }}>
          Customer
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
          {selectedItem.user} ({selectedItem.suite})
        </Typography>
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7280', fontSize: '0.875rem', fontWeight: 600 }}>
          OTP
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
          {selectedItem.otp}
        </Typography>
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7280', fontSize: '0.875rem', fontWeight: 600 }}>
          Tracking / Order No.
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
          {selectedItem.tracking_no || 'N/A'}
        </Typography>
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7280', fontSize: '0.875rem', fontWeight: 600 }}>
          ETA
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
          {selectedItem.estimate_arrival_time}
        </Typography>
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7280', fontSize: '0.875rem', fontWeight: 600 }}>
          Status
        </Typography>
        <Chip
          label={selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1).toLowerCase()}
          size="small"
          sx={{
            bgcolor: selectedItem.status.toLowerCase() === 'received' ? '#dcfce7' : '#fef3c7',
            color: selectedItem.status.toLowerCase() === 'received' ? '#166534' : '#92400e',
            fontWeight: 700,
            fontSize: '0.75rem',
            height: '24px',
            borderRadius: '5px'
          }}
        />
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7280', fontSize: '0.875rem', fontWeight: 600 }}>
          Package Details
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
          {selectedItem.details || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ReceiveModalContent;