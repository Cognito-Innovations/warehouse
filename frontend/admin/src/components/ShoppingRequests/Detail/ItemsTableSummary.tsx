import { Box, Typography, Divider } from '@mui/material';

interface SummaryRowProps {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, children }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <Typography variant="body2" color="text.secondary">{label} {children}</Typography>
    <Typography variant="body2" fontWeight={500}>{value}</Typography>
  </Box>
);

interface ItemsTableSummaryProps {
  summary?: {
    subTotal?: number;
    commission?: number;
    total?: number;
    currency?: string;
  };
}

const ItemsTableSummary: React.FC<ItemsTableSummaryProps> = ({ summary = {} }) => (
  <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
    <Box sx={{ width: '300px' }}>
      <SummaryRow label="Sub Total" value={summary.subTotal?.toFixed(2)} />

      <SummaryRow label="Commission (8%)" value={summary.commission?.toFixed(2)}></SummaryRow>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" fontWeight={600}>Total</Typography>
        <Typography variant="body1" fontWeight={600}>{summary.total?.toFixed(2)}</Typography>
      </Box>
    </Box>
  </Box>
);


export default ItemsTableSummary;