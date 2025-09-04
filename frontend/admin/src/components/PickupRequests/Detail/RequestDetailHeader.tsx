import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Paper, TextField } from '@mui/material';
import CustomerInfo from './CustomerInfo';
import { updatePickupRequestStatus } from '../../../services/api.services';
import { getChipStyles } from '../../../utils/pickupStatus';
import Modal from '../../common/Modal';
import ActionButton from '../../common/ActionButton';

interface Users {
  id: string;
  name: string;
  email: string;
  phoneNumbers?: string[];
}

interface Request {
  id: string;
  status: string;
  users: Users;
}

interface RequestDetailHeaderProps {
  request: Request;
  onStatusUpdate: () => void;
}

const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({ request, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [price, setPrice] = useState('');

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleConfirmQuotation = async () => {
    try {
      setLoading(true);
      await updatePickupRequestStatus(request.id, 'QUOTED', Number(price));
      onStatusUpdate();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      await updatePickupRequestStatus(request.id, 'PICKED');
      onStatusUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid #EAEAEA',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            Pickup Request #: {request.id}
          </Typography>
          <Chip
            label={request.status}
            size="small"
            sx={{
              ...getChipStyles(request.status),
              fontWeight: '600',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '0.5px',
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          {request.status === "REQUESTED" && (
            <>
              <ActionButton
                label="Send Quotation"
                onClick={handleOpenModal}
                color="primary"
                loading={loading}
              />
              <ActionButton label="Reject" color="danger" />
            </>
          )}

          {request.status === "QUOTED" && (
            <ActionButton label="Reject" color="danger" />
          )}

          {request.status === "CONFIRMED" && (
            <ActionButton
              label="Complete"
              onClick={handleComplete}
              color="primary"
              loading={loading}
            />
          )}
        </Box>
      </Box>

      <CustomerInfo user={request.users} />

      <Modal open={openModal} onClose={handleCloseModal} title="Send Quotation">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Quotation Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleConfirmQuotation}
            disabled={loading || !price}
          >
            {loading ? 'Sending...' : 'Confirm'}
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default RequestDetailHeader;