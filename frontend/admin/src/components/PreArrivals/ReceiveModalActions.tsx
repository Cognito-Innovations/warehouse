import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

import type { PreArrival } from '../../types/PreArrival';

interface ReceiveModalActionsProps {
  selectedItem: PreArrival;
  isReceiving: boolean;
  onReceiveClick: () => void;
}

const ReceiveModalActions: React.FC<ReceiveModalActionsProps> = ({
  selectedItem,
  isReceiving,
  onReceiveClick
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={onReceiveClick}
        disabled={selectedItem.status.toLowerCase() === 'received' || isReceiving}
        sx={{
          minWidth: 100,
          fontWeight: 600,
          bgcolor: '#8b5cf6',
          '&:hover': { bgcolor: '#7c3aed' }
        }}
      >
        {isReceiving ? <CircularProgress size={24} color="inherit" /> : 'Receive'}
      </Button>
    </Box>
  );
};

export default ReceiveModalActions;