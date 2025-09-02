import { Box, Typography, Button, Chip } from '@mui/material';
import { getRequestStatusColor } from '../../../data/shoppingRequests';

const RequestDetailHeader = ({ request }: { request: any }) => {
  const status = getRequestStatusColor(request.status);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={600}>
          Shopping Request # {request.id}
        </Typography>
        <Chip
          label={request.status}
          size="small"
          sx={{ ml: 2, color: status.color, bgcolor: status.bgColor, fontWeight: 600 }}
        />
      </Box>
      <Box>
        <Button variant="contained" color="primary" sx={{ mr: 1, textTransform: 'none' }}>
          Send Quotation
        </Button>
        <Button variant="contained" sx={{ bgcolor: '#FEE2E2', color: '#EF4444', '&:hover': { bgcolor: '#FECACA' }, textTransform: 'none' }}>
          Reject
        </Button>
      </Box>
    </Box>
  );
};
export default RequestDetailHeader;