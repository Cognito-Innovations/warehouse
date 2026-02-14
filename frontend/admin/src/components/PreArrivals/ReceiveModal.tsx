import React, { useState } from 'react';
import { Box, Modal } from '@mui/material';

import ReceiveModalHeader from './ReceiveModalHeader';
import ReceiveModalContent from './ReceiveModalContent';
import ReceiveModalActions from './ReceiveModalActions';
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
  const [isReceiving, setIsReceiving] = useState(false);

  const handleReceiveClick = async () => {
    setIsReceiving(true);
    try {
      await onReceive();
    } catch (error) {
      console.error("Failed to receive item:", error);
    } finally {
      setIsReceiving(false);
    }
  };

  if (!selectedItem) return null;

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        if (!isReceiving) {
          onClose();
        }
      }} 
      aria-labelledby="customer-details-modal"
      aria-describedby="customer-details-description"
    >
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
        <ReceiveModalHeader onClose={onClose} />

        <ReceiveModalContent selectedItem={selectedItem} />

        <ReceiveModalActions
          selectedItem={selectedItem}
          isReceiving={isReceiving}
          onReceiveClick={handleReceiveClick}
        />
      </Box>
    </Modal>
  );
};

export default ReceiveModal;
