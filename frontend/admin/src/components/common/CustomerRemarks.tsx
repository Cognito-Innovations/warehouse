import React from 'react';
import { Card, Typography } from '@mui/material';

interface CustomerRemarksProps {
  remarks: string | null | undefined;
}

const CustomerRemarks: React.FC<CustomerRemarksProps> = ({ remarks }) => {
  if (!remarks) {
    return null;
  }

  return (
    <Card sx={{ p: 2, mt: 1 }}>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Customer Remarks
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {remarks}
      </Typography>
    </Card>
  );
};

export default CustomerRemarks;