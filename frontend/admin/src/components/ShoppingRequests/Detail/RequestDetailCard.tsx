import { Box, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { toast } from 'sonner';

import { getDisplayStatus, } from '../../../data/shoppingRequests';
import { updateShoppingRequestStatus } from '../../../services/api.services';
import RequestHeader from '../../common/RequestHeader';
import { getStatusColor } from '../../../utils/statusUtils';

interface RequestDetailCardProps {
  request: any;
  onStatusUpdated: () => void;
  products: any[];
  selectedItemIds: Set<string>;
}

const RequestDetailCard = ({ request, onStatusUpdated, products, selectedItemIds }: RequestDetailCardProps) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const normalizeStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "QUOTED":
        return "QUOTATION_READY";
      default:
        return status.toUpperCase();
    }
  };

  const latestStatus = normalizeStatus(request.status);
  const statusStyles = getStatusColor(latestStatus);

  const handleStatusChange = async (newStatus: string, actionName: string) => {
    setActiveAction(actionName);
    try {
      await updateShoppingRequestStatus(request.id, newStatus);
      onStatusUpdated();
      toast.success("Status updated successfully!");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status.");
    } finally {
      setActiveAction(null);
    }
  };

  const handleSendQuotation = () => {
    if (selectedItemIds.size === 0) {
      toast.error("You must select an item before sending a quotation.");
      return;
    }

    const itemToQuote = products.filter(product => selectedItemIds.has(product.id));
    const unpricedItems = itemToQuote.filter(product => !product.unit_price || product.unit_price <= 0);

    if (unpricedItems.length > 0) {
      toast.error("Please update the unit price for all selected items before sending the quotation.");
      return;
    }

    handleStatusChange("QUOTATION_READY", "sending");
  }

  const renderActionButton = () => {
    const rejectableStatuses = [
      "REQUESTED", 
      "QUOTATION_READY", 
      "QUOTATION_CONFIRMED", 
      "INVOICED", 
      "PAYMENT_PENDING"
    ];

    return (
      <>
        {latestStatus === "REQUESTED" && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1, textTransform: 'none' }}
            onClick={handleSendQuotation}
            disabled={!!activeAction}
          >
            {activeAction === 'sending' ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Sending...
              </Box>
            ) : "Send Quotation"}
          </Button>
        )}

        {rejectableStatuses.includes(latestStatus) && (
          <Button
            variant="contained"
            sx={{
              bgcolor: '#FEE2E2',
              color: '#EF4444',
              '&:hover': { bgcolor: '#FECACA' },
              textTransform: 'none'
            }}
            onClick={() => handleStatusChange("REJECTED", 'reject')}
            disabled={!!activeAction}
          >
            {activeAction === 'rejecting' ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Rejecting...
              </Box>
            ) : "Reject"}
          </Button>
        )}
    
    {latestStatus === "PAYMENT_APPROVED" && (
      <Button
        variant="contained"
        sx={{ textTransform: 'none' }}
        onClick={() => handleStatusChange("ORDER_PLACED", "approving")}
        disabled={!!activeAction}
      >
        {activeAction === "approving" ?
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            Completing...
          </Box>
          : "Complete"}
      </Button>
      )}
    </>
  );
};

  return (
    <>
      <RequestHeader
        title="Shopping Request"
        requestCode={request.request_code}
        statusDisplay={getDisplayStatus(latestStatus)}
        statusChipStyles={{
          color: statusStyles.color,
          bgColor: statusStyles.bgColor,
        }}
        customer={request.user}
        actionButtons={renderActionButton()}
      />
    </>
  );
};

export default RequestDetailCard;