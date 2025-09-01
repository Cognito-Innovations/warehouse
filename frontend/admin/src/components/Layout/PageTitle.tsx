import React from 'react';
import { Box, Typography } from '@mui/material';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <Box sx={{ }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
        {title} {subtitle && `/ ${subtitle}`}
      </Typography>
    </Box>
  );
};

export default PageTitle;
