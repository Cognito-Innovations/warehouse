import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { updateShipmentExport } from '../../services/api.services';
import Modal from '../common/Modal';

interface UpdateMawbModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  shipment: any | null;
}

const UpdateMawbModal: React.FC<UpdateMawbModalProps> = ({ open, onClose, onUpdate, shipment }) => {
  const [mawb, setMawb] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (shipment) {
      setMawb(shipment.mawb || '');
    } else {
      setMawb('');
    }
  }, [shipment]);

  const handleSave = async () => {
    if (!shipment || !mawb) return;
    try {
      setSaving(true);
      await updateShipmentExport(shipment.id, { mawb });
      await onUpdate();
      handleClose();
    } catch (error) {
      console.error("Failed to update MAWB:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Update MAWB"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          label="MAWB"
          value={mawb}
          onChange={(e) => setMawb(e.target.value)}
          fullWidth
          required
          autoFocus
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!mawb || saving}
            sx={{ textTransform: 'none' }}
          >
            {saving ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={24} color="inherit" />
                Saving...
              </Box>
            ) : (
              'Save'
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateMawbModal;
