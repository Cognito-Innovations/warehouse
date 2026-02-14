import React from 'react';
import { Box, Typography } from "@mui/material";

interface DetailItemProps {
  label: string;
  value: string | number | undefined;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ 
        display: 'block', 
        mb: 0.75,
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.025em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        whiteSpace: 'pre-wrap',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'text.primary',
        lineHeight: 1.5,
      }}
    >
      {value || "-"}
    </Typography>
  </Box>
);

export default DetailItem;