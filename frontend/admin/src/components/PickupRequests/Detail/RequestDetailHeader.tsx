import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

import { updatePickupRequestStatus } from '../../../services/api.services';
import RequestHeader from '../../common/RequestHeader';
import Modal from '../../common/Modal';
import ActionButton from '../../common/ActionButton';
import { TRACKING_STATUS } from '../../../utils/trackingConfig';
import { getChipStyles } from '../../../utils/pickupStatus';
import { numberInputStyle } from '../../../styles/numberInputStyle';

type TrackingStatusValue = (typeof TRACKING_STATUS)[keyof typeof TRACKING_STATUS];

interface Users {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  suite_no?: string;
}

interface Request {
  id: string;
  status: string;
  user: Users;
}

interface RequestDetailHeaderProps {
  request: Request;
  onStatusUpdate: () => void;
}

const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({ request, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [price, setPrice] = useState('');

  const normalizedStatus = request.status.toUpperCase();
  const chipStyles = getChipStyles(normalizedStatus);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setPrice(''); //  TODO: Price should be reset 0 or ''
    setOpenModal(false);
  }

  const handleStatusUpdate = async (status: TrackingStatusValue, price?: number) => {
    try {
      setLoading(true);
      await updatePickupRequestStatus(request.id, status, price);
      onStatusUpdate();
      if (status === TRACKING_STATUS.QUOTED) {
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const customerForHeader = {
    name: request.user.name,
    email: request.user.email,
    phone: request.user.phone_number,
    suite_no: request.user.suite_no,
  };

  const renderActionButtons = () => (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      {normalizedStatus === "REQUESTED" && (
        <ActionButton
          label="Send Quotation"
          onClick={handleOpenModal}
          color="primary"
          loading={loading}
        />
      )}

      {normalizedStatus === "QUOTED" && (
        <ActionButton
          label="Reject"
          onClick={() => handleStatusUpdate(TRACKING_STATUS.CANCELLED)}
          color="danger"
          loading={loading}
        />
      )}

      {normalizedStatus === "CONFIRMED" && (
        <ActionButton
          label="Complete"
          onClick={() => handleStatusUpdate(TRACKING_STATUS.PICKED)}
          color="primary"
          loading={loading}
        />
      )}
    </Box>
  );

  return (
    <>
      <RequestHeader
        title="Pickup Request"
        requestCode={request.id}
        statusDisplay={normalizedStatus}
        statusChipStyles={{
          color: chipStyles.color,
          bgColor: chipStyles.backgroundColor,
        }}
        customer={customerForHeader}
        actionButtons={renderActionButtons()}
      />

      <Modal open={openModal} onClose={handleCloseModal} title="Send Quotation ($)">
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
            onClick={() => handleStatusUpdate(TRACKING_STATUS.QUOTED, Number(price))}
            disabled={loading || !price}
          >
            {loading ? 'Sending...' : 'Confirm'}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default RequestDetailHeader;