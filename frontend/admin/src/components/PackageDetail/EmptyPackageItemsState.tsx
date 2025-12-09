import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyPackageItemsState: React.FC = () => {
  return (
    <Box sx={{ 
      p: 4, 
      textAlign: 'center', 
      bgcolor: '#f8fafc', 
      borderRadius: 2, 
      border: '1px solid #e2e8f0' 
    }}>
      <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
        No package items added yet
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
        Click "Add Item" to start adding products to this package
      </Typography>
    </Box>
  );
};

export default EmptyPackageItemsState;