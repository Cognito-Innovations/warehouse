import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import { useShipmentDetail } from '../../../contexts/ShipmentDetailContext';
import UpdateRackSlotModal from './UpdateRackSlotModal';

const RackSlotInfo: React.FC = () => {
  const { shipment, isDiscarded } = useShipmentDetail();

  const [rackModalOpen, setRackModalOpen] = useState(false);

  const handleOpenRackModal = () => {
    if (!isDiscarded) {
      setRackModalOpen(true);
    }
  };

  const handleCloseRackModal = () => setRackModalOpen(false);

  return (
    <>
      <Box
        onClick={handleOpenRackModal}
        sx={{
          bgcolor: isDiscarded ? '#f1f5f9' : '#f0fdf4',
          p: 2,
          borderRadius: 2,
          border: isDiscarded ? '1px solid #cbd5e1' : '1px solid #84cc16',
          width: '220px',
          cursor: isDiscarded ? 'not-allowed' : 'pointer',
          opacity: isDiscarded ? 0.6 : 1,
          mb: 3,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
          {shipment.rack_slot?.label} →
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#166534' }}>
          {`Slot has ${shipment.rack_slot?.count} pkgs`}
        </Typography>
      </Box>

      {rackModalOpen && (
        <UpdateRackSlotModal
          open={rackModalOpen}
          onClose={handleCloseRackModal}
        />
      )}
    </>
  );
};

export default RackSlotInfo;