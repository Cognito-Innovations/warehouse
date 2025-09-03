'use client';

import { Paper, Typography } from '@mui/material';

interface QuotedPriceCardProps {
  price?: number;
}

export default function QuotedPriceCard({ price }: QuotedPriceCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 2,
        border: '1px solid #E0E0E0',
        borderRadius: 2,
        backgroundColor: '#F9FAFB',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Quoted Price
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        ₹{price || '—'}
      </Typography>
    </Paper>
  );
}