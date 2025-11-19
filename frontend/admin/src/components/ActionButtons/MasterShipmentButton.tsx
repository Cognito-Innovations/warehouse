import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MasterShipmentButtonProps {
  data: any;
  onRefresh: () => void;
}

const MasterShipmentButton: React.FC<MasterShipmentButtonProps> = ({ data }) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const exportId = data.shipmentExportBox?.shipmentExport?.id;
  
  const handleMasterShipmentClick = async () => {
    if (!exportId) {
      toast.error("This shipment is not part of any Shipment Export yet.");
      return;
    }

    setIsNavigating(true);
    try {
      navigate(`/shipment/export/${exportId}`);
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Failed to navigate. Please try again.");
    } finally {
      setIsNavigating(false);
    }
  }

  const isDisabled = !exportId || isNavigating;

  return (
    <Button
      variant="contained"
      startIcon={isNavigating ? <CircularProgress size={20} color="inherit" /> : null}
      onClick={handleMasterShipmentClick}
      disabled={isDisabled}
      sx={{
          textTransform: 'none',
          bgcolor: "#a855f7",
          "&:hover": { bgcolor: "#9333ea" },
      }}
    >
      {isNavigating ? 'Navigating...' : 'Master Shipment'}
    </Button>
  )
}

export default MasterShipmentButton;