import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { formatDateTime } from '../../../utils/formatDateTime';

interface TrackingItemProps {
  status: string;
  description?: string;
  createdAt?: string;
  completed: boolean;
  isLast: boolean;
}

const TrackingItem: React.FC<TrackingItemProps> = ({
  status,
  description,
  createdAt,
  completed,
  isLast,
}) => (
  <Box sx={{ display: 'flex' }}>
    <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {completed ? (
        <CheckCircleIcon sx={{ color: '#22C55E', fontSize: '1.75rem' }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ color: 'grey.400', fontSize: '1.75rem' }} />
      )}
      {!isLast && (
        <Box sx={{ width: '2px', flexGrow: 1, bgcolor: 'grey.300', my: 0.5 }} />
      )}
    </Box>

    <Box sx={{ pb: isLast ? 0 : 2.5, mt: '-4px' }}>
      <Typography
        variant="body2"
        fontWeight={600}
        color={completed ? 'text.primary' : 'text.secondary'}
        sx={{ mb: 0.5 }}
      >
        {status}
      </Typography>

      {description && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {description}
        </Typography>
      )}

      {createdAt && (
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(createdAt)}
        </Typography>
      )}
    </Box>
  </Box>
);

export default TrackingItem;
