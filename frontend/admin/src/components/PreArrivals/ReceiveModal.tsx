import React from 'react';
import { Box, Typography, Modal, IconButton, Button, Chip } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { PreArrival } from '../../types/PreArrival';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: PreArrival | null;
  onReceive: () => void;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({
  isOpen,
  onClose,
  selectedItem,
  onReceive
}) => {
  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="customer-details-modal" aria-describedby="customer-details-description">
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 650,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        {/* Modal Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Receive
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        {selectedItem && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ mb: 0.5, color: '#6b7280', fontSize: '0.875rem', fontWeight: 600 }}>
                Customer
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
                {selectedItem.customer} ({selectedItem.suite})
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
        )}

        {/* Modal Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onReceive}
            disabled={selectedItem?.status.toLowerCase() === 'received'}
            sx={{ minWidth: 100, fontWeight: 600, bgcolor: '#8b5cf6','&:hover': { bgcolor: '#7c3aed'}}}>
            Receive
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReceiveModal;
