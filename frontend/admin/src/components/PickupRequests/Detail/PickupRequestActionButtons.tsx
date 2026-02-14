import React from 'react';
import { Box } from '@mui/material';

import ActionButton from '../../common/ActionButton';
import { PICKUP_REQUEST_ACTIONS } from '../../../utils/pickupRequestActions';
import type { TrackingStatusValue } from '../../../types';

interface PickupRequestActionButtonsProps {
  status: string;
  loading: boolean;
  onOpenModal: () => void;
  onStatusUpdate: (status: TrackingStatusValue) => void;
}

const PickupRequestActionButtons: React.FC<PickupRequestActionButtonsProps> = ({
  status,
  loading,
  onOpenModal,
  onStatusUpdate,
}) => {
  const actions = PICKUP_REQUEST_ACTIONS[status] || [];

  if (!actions.length) return null;

  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      {actions.map((action) => (
        <ActionButton
          key={action.label}
          label={action.label}
          color={action.color}
          loading={loading}
          onClick={() => {
            if (action.requiresModal) {
              onOpenModal();
            } else if (action.statusToUpdate) {
              onStatusUpdate(action.statusToUpdate);
            }
          }}
        />
      ))}
    </Box>
  );
};

export default PickupRequestActionButtons;