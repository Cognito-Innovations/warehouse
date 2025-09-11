import React from 'react';
import { Box, Typography } from "@mui/material";

const InvoiceSlips: React.FC<{ slips?: any[] }> = ({ slips }) => {
  return (
    <Box mt={2} mb={2}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Payment Slips
      </Typography>
      <Box display="flex" gap={1.5} flexWrap="wrap">
        {slips?.length ? (
          slips.map(() => {
            return null;
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No payment slips have been uploaded for this invoice.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default InvoiceSlips;