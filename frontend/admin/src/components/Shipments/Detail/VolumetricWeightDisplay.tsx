import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  volumetricWeight: string | null;
  dimensions: string | null;
  hasMeasurements: boolean;
}

export const VolumetricWeightDisplay: React.FC<Props> = ({
  volumetricWeight,
  dimensions,
  hasMeasurements,
}) => {
  if (!hasMeasurements) {
    return (
      <Box component="span">
        <Typography component="span" sx={{ color: '#1e293b', fontWeight: 600 }}>
          -
        </Typography>
        <Typography
          component="span"
          sx={{ color: '#ef4444', fontWeight: 600, ml: 0.5 }}
        >
          (no measurements)
        </Typography>
      </Box>
    );
  }

  return (
    <Typography component="span" sx={{ color: '#1e293b' }}>
      {volumetricWeight} kg
      {dimensions && (
        <Typography
          component="span"
          sx={{ color: '#64748b', ml: 0.5, fontSize: '0.875rem' }}
        >
          {dimensions}
        </Typography>
      )}
    </Typography>
  );
};