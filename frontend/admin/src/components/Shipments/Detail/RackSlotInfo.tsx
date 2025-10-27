import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import UpdateRackSlotModal from './UpdateRackSlotModal';

interface RackSlotInfoProps {
  shipments: {
    id: string;
    tracking_no: string;
    rack_slot?: {
      label: string;
      color: string;
      count?: number;
    };
    updated_by?: {
      name: string;
    }
    updated_at: string;
    [key: string]: unknown; 
  };
  onRefresh: () => void;
}

const RackSlotInfo: React.FC<RackSlotInfoProps> = ({ shipments, onRefresh }) => {
  const [rackModalOpen, setRackModalOpen] = useState(false);

  const handleOpenRackModal = () => {
    setRackModalOpen(true);
  };

  const handleCloseRackModal = () => setRackModalOpen(false);

  return (
    <>
      <Box
        onClick={handleOpenRackModal}
        sx={{
          bgcolor: '#f0fdf4',
          p: 2,
          borderRadius: 2,
          border: '1px solid #84cc16',
          width: '220px',
          cursor: 'pointer',
          opacity: 1,
          mb: 3,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#166534', display: 'flex', alignItems: 'center', gap: 1 }}>
          {shipments.rack_slot?.label} →
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#166534' }}>
          {`Slot has ${shipments.rack_slot?.count} pkgs`}
        </Typography>
      </Box>

      {rackModalOpen && (
        <UpdateRackSlotModal
          open={rackModalOpen}
          onClose={handleCloseRackModal}
          onRefresh={onRefresh}
          shipments={{
            id: shipments.id,
            rack_slot: shipments.rack_slot,
            updated_by: shipments.updated_by,
            updated_at: shipments.updated_at,
          }}
        />
      )}
    </>
  );
};

export default RackSlotInfo;