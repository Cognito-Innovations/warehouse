import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import type { PackageData } from "../../types";

interface MasterShipmentButtonProps {
  data: PackageData;
  onRefresh: () => void;
}

const MasterShipmentButton: React.FC<MasterShipmentButtonProps> = ({ data, onRefresh }) => {

  return (
    <Button
      variant="contained"
    //   startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
    //   onClick={handleUpdateToDeparted}
    //   disabled={isUpdating}
      sx={{
          textTransform: 'none',
          bgcolor: "#a855f7",
          "&:hover": { bgcolor: "#9333ea" },
      }}
    >
      {/* {isUpdating ? 'Updating...' : 'Update to Departed'} */}
      Master Shipment
    </Button>
  )
}

export default MasterShipmentButton;