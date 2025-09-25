import { Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { toast } from 'sonner';

import { getDisplayStatus, getRequestStatusColor } from '../../../data/shoppingRequests';
import { updateShoppingRequestStatus } from '../../../services/api.services';
import RequestHeader from '../../common/RequestHeader';

interface RequestDetailCardProps {
  request: any;
  onStatusUpdated: () => void;
  products: any[];
  selectedItemIds: Set<string>;
}

const RequestDetailCard = ({ request, onStatusUpdated, products, selectedItemIds }: RequestDetailCardProps) => {
  const [loading, setLoading] = useState(false);

  const normalizeStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "QUOTED":
        return "QUOTATION_READY";
      default:
        return status.toUpperCase();
    }
  };

  const latestStatus = normalizeStatus(request.status);
  const statusStyles = getRequestStatusColor(latestStatus);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateShoppingRequestStatus(request.id, newStatus);
      onStatusUpdated();
      toast.success("Status updated successfully!");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status.");
    } finally {
      setLoading(false);
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

    handleStatusChange("QUOTATION_READY");
  }

  const renderActionButton = () => {
    if (latestStatus === "REQUESTED") {
      return (
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1, textTransform: 'none' }}
          onClick={handleSendQuotation}
          disabled={loading}
        >
          {loading ?
            <>
              <CircularProgress size={20} color="inherit" />
              Sending...
            </>
            : "Send Quotation"}
        </Button>
      );
    }

    if (latestStatus === "QUOTATION_READY") {
      return (
        <Button
          variant="contained"
          sx={{
            bgcolor: '#FEE2E2',
            color: '#EF4444',
            '&:hover': { bgcolor: '#FECACA' },
            textTransform: 'none'
          }}
          onClick={() => handleStatusChange("REJECTED")}
          disabled={loading}
        >
          {loading ?
            <>
              <CircularProgress size={20} color="inherit" />
              Rejecting...
            </>
            : "Reject"}
        </Button>
      );
    }

    if (latestStatus === "PAYMENT_APPROVED") {
      return (
        <Button
          variant="contained"
          sx={{ textTransform: 'none' }}
          onClick={() => handleStatusChange("ORDER_PLACED")}
          disabled={loading}
        >
          {loading ?
            <>
              <CircularProgress size={20} color="inherit" />
              Completing...
            </>
            : "Complete"}
        </Button>
      );
    }

    return null;
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