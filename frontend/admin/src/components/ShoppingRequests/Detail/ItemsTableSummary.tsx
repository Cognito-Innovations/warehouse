import { Box, Typography, Link, Divider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const SummaryRow = ({ label, value, children }: any) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <Typography variant="body2" color="text.secondary">{label} {children}</Typography>
    <Typography variant="body2" fontWeight={500}>${value}</Typography>
  </Box>
);

const ItemsTableSummary = ({ summary = {} }: { summary?: any }) => (
  <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
    <Box sx={{ width: '300px' }}>
      <SummaryRow label="Sub Total" value={summary.subTotal ? summary.subTotal.toFixed(2) : "0.00"} />
      <SummaryRow label="Commission (8%)" value={summary.commission ? summary.commission.toFixed(2) : "0.00"}>
        <Link href="#" sx={{ color: 'inherit' }}>Edit</Link>
      </SummaryRow>
      <SummaryRow label="GST (8%)" value={summary.gst ? summary.gst.toFixed(2) : "0.00"}>
        <InfoOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle', color: 'grey.500' }} />
      </SummaryRow>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" fontWeight={600}>Total</Typography>
        <Typography variant="body1" fontWeight={600}>${summary.total ? summary.total.toFixed(2) : "0.00"}</Typography>
      </Box>
    </Box>
  </Box>
);


export default ItemsTableSummary;