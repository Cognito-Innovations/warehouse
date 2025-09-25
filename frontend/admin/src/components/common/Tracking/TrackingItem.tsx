import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
        <CheckCircleIcon sx={{ color: '#22C55E', fontSize: '1.75rem', zIndex: 1, bgcolor: 'background.paper' }} />
      ) : (
        <Box
          sx={{
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'grey.300',
            zIndex: 1,
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: 'grey.400',
            }}
          />
        </Box>
      )}
      {!isLast && (
        <Box
          sx={{
            width: '2px',
            flexGrow: 1,
            bgcolor: completed ? '#22C55E' : 'grey.300',
            mt: '-2px',
            mb: '-2px',
          }}
        />
      )}
    </Box>

    <Box sx={{ pb: isLast ? 0 : 3.5, mt: '-6px' }}>
      <Typography
        variant="body1"
        fontWeight={500}
        color={completed ? 'text.primary' : 'text.secondary'}
        sx={{ mb: 0.25 }}
      >
        {status}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}

        {createdAt && (
          <Typography variant="caption" color="text.secondary">
            {createdAt}
          </Typography>
        )}
      </Box>
    </Box>
  </Box>
);

export default TrackingItem;