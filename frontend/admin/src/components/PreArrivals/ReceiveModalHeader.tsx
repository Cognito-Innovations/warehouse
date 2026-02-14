import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ReceiveModalHeaderProps {
  onClose: () => void;
}

const ReceiveModalHeader: React.FC<ReceiveModalHeaderProps> = ({ onClose }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
        Receive
      </Typography>
      <IconButton onClick={onClose} size="small">
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default ReceiveModalHeader;