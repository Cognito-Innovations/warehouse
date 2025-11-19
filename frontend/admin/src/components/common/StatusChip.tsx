import React from 'react';
import { Chip } from '@mui/material';
import { getStatusColor } from '../../utils/statusUtils';

interface StatusChipProps {
  status: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const { color, bgColor } = getStatusColor(status);

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        color: color,
        bgcolor: bgColor,
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: '6px',
        textTransform: 'uppercase',
      }}
    />
  );
};

export default StatusChip;