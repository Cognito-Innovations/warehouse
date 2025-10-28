import { Button } from "@mui/material"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ConfirmDialog from "../common/ConfirmDialog";
import { updateShipmentStatus } from "../../services/api.services";

interface DiscardShipmentButtonProps {
  data: any;
}

const DiscardShipmentButton: React.FC<DiscardShipmentButtonProps> = ({ data }) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOpenDiscardDialog = () => {
    setDiscardDialogOpen(true);
  };

  const handleCloseDiscardDialog = () => {
    setDiscardDialogOpen(false);
  };

  const handleDiscard = async () => {
      if (!data.id) return;
      setLoading(true);
      try {
        await updateShipmentStatus(data.id, "DISCARDED")
        toast.success("Shipment discarded successfully!");
        setDiscardDialogOpen(false);
        navigate("/shipments");
      } catch (err) {
        console.error("Failed to discard shipment:", err);
        toast.error("Failed to discard shipment");
      } finally {
        setLoading(false);
      }
  };

  return (
    <>  
      <Button
        variant="contained"
        onClick={handleOpenDiscardDialog}
        sx={{
          bgcolor: '#ef4444',
          '&:hover': { bgcolor: '#dc2626' },
          textTransform: 'none',
          borderRadius: 1,
        }}
      >
        Discard
      </Button>
      
      <ConfirmDialog
        open={discardDialogOpen}
        onClose={handleCloseDiscardDialog}
        onConfirm={handleDiscard}
        title="Discard Shipment"
        message="Are you sure you want to discard this shipment? This action cannot be undone."
        confirmText="Discard"
        cancelText="Cancel"
        isLoading={loading}
      />
    </>
  )
}

export default DiscardShipmentButton;