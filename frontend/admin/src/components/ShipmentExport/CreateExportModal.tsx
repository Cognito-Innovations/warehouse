import React, { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createShipmentExport } from '../../services/api.services';
import Modal from '../common/Modal';
import { numberInputStyle } from '../../styles/numberInputStyle';

interface CreateExportModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const CreateExportModal: React.FC<CreateExportModalProps> = ({ open, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const [noOfBoxes, setNoOfBoxes] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        export_code: `MS/IN/${Date.now()}`,
        boxes_count: parseInt(noOfBoxes, 10),
        created_by: 'admin-123',
      };

      const request = await createShipmentExport(payload);
      onUpdate();
      if (request?.id) {
        navigate(`/shipment/export/${request.id}`);
      }
    } catch (err) {
      console.error('Failed to create export:', err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleClose = () => {
    setNoOfBoxes("1");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Export" size="xs">
      <Box sx={{ width: '100%' }}>
        <TextField
          label="No of Boxes"
          value={noOfBoxes}
          onChange={(e) => setNoOfBoxes(e.target.value)}
          fullWidth
          required
          size="small"
          type="number"
          sx={{ ...numberInputStyle, mb: 1 }}
        />

        <Typography variant="caption" color="text.secondary">
          Note: Later you can edit no of boxes
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              bgcolor: '#7c3aed',
              '&:hover': { bgcolor: '#6d28d9' },
              px: 3,
              py: 1,
              fontWeight: 500,
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateExportModal;
