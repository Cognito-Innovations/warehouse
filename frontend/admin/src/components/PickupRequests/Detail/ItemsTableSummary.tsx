import { Box, Typography, Link, Divider } from '@mui/material';
import { type ReactNode } from 'react';

interface SummaryRowProps {
  label: string;
  value: number | string;
  children?: ReactNode;
}

const SummaryRow = ({ label, value, children }: SummaryRowProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <Typography variant="body2" color="text.secondary">{label} {children}</Typography>
    <Typography variant="body2" fontWeight={500}>${value}</Typography>
  </Box>
);

interface Summary {
  subTotal: number;
  commission: number;
  total: number;
}

interface ItemsTableSummaryProps {
  summary: Summary;
}

const ItemsTableSummary = ({ summary }: ItemsTableSummaryProps) => (
  <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
    <Box sx={{ width: '300px' }}>
      <SummaryRow label="Sub Total" value={summary.subTotal.toFixed(2)} />
      <SummaryRow label="Commission (0%)" value={summary.commission.toFixed(2)}>
        <Link href="#" sx={{ color: 'inherit' }}>Edit</Link>
      </SummaryRow>
      <Divider sx={{ my: 1 }}/>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" fontWeight={600}>Total</Typography>
        <Typography variant="body1" fontWeight={600}>${summary.total.toFixed(2)}</Typography>
      </Box>
    </Box>
  </Box>
);

export default ItemsTableSummary;