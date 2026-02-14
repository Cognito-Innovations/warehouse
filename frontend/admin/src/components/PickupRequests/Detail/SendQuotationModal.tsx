import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

import Modal from '../../common/Modal';
import { TRACKING_STATUS } from '../../../utils/trackingConfig';
import { numberInputStyle } from '../../../styles/numberInputStyle';
import type { TrackingStatusValue } from '../../../types';

interface SendQuotationModalProps {
  requestId: string;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (status: TrackingStatusValue, price?: number) => Promise<void>;
}

const SendQuotationModal: React.FC<SendQuotationModalProps> = ({
  open,
  loading,
  onClose,
  onSubmit,
}) => {
  const [price, setPrice] = useState('');

  const handleClose = () => {
    setPrice('');
    onClose();
  };

  const handleConfirm = async () => {
    await onSubmit(TRACKING_STATUS.QUOTED, Number(price));
    setPrice('');
  };

  return (
    <Modal open={open} onClose={handleClose} title="Send Quotation ($)">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Quotation Price ($)"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => {
            if (e.target.value.length <= 7) {
              setPrice(e.target.value);
            }
          }}
          sx={numberInputStyle}
        />

        {price && (
          <Typography variant="body2" color="text.secondary">
            Total: ${price}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading || !price}
        >
          {loading ? 'Sending...' : 'Confirm'}
        </Button>
      </Box>
    </Modal>
  );
};

export default SendQuotationModal;