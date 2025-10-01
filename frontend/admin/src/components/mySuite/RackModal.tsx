import React, { useState } from 'react';
import { Box } from '@mui/material';
import Modal from '../common/Modal';
import AddRackForm from './AddRackForm';
import type { Rack } from '../../types';
import { createRack, updateRack } from '../../services/api.services';

interface RackModalProps {
  open: boolean;
  rack?: Rack | null;
  onClose: () => void;
  onSuccess: (rack: Rack) => void;
}

const RackModal: React.FC<RackModalProps> = ({ open, rack, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (label: string, color: string) => {
    setSubmitting(true);
    try {
      if (rack) {
        const updated = await updateRack(rack.id!, { label, color });
        onSuccess(updated);
      } else {
        const response = await createRack({ label, color, count: 0 });
        const newRack = Array.isArray(response) ? response[0] : response;
        onSuccess(newRack);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save rack', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal 
      open={open}
      onClose={onClose}
      title={rack ? "Edit Rack" : "Add Rack"}
    >
      <Box sx={{ width: '100%' }}>
        <AddRackForm
          mode={rack ? "edit" : "add"}
          initialLabel={rack?.label}
          initialColor={rack?.color}
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </Box>
    </Modal>
  );
};

export default RackModal;
