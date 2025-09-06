import { Box, Typography, Button, Chip } from '@mui/material';
import { getDisplayStatus, getRequestStatusColor } from '../../../data/shoppingRequests';
import { updateShoppingRequestStatus } from '../../../services/api.services';

const RequestDetailHeader = ({ request, onStatusUpdated }: { request: any, onStatusUpdated: () => void }) => {
  const status = getRequestStatusColor(request.status);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateShoppingRequestStatus(request.id, newStatus);
      onStatusUpdated();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={600}>
          Shopping Request # {request.request_code}
        </Typography>
        <Chip
          label={getDisplayStatus(request.status)}
          size="small"
          sx={{ ml: 2, color: status.color, bgcolor: status.bgColor, fontWeight: 600 }}
        />
      </Box>
      <Box>
        {request.status === "REQUESTED" && (
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mr: 1, textTransform: 'none' }}
            onClick={() => handleStatusChange("QUOTATION_READY")}
          >
            Send Quotation
          </Button>
        )}
        
        {request.status === "REQUESTED" && request.status === "QUOTATION_READY" && (
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#FEE2E2', color: '#EF4444', '&:hover': { bgcolor: '#FECACA' }, textTransform: 'none'}}
             onClick={() => handleStatusChange("REJECTED")}
          >
            Reject
          </Button>
        )}

        {request.status === "PAYMENT_APPROVED" && (
          <Button 
            variant="contained" 
            sx={{ textTransform: 'none' }}
            onClick={() => handleStatusChange("ORDER_PLACED")}
          >
            Complete
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default RequestDetailHeader;