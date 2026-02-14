import React, { useState } from "react";
import { Button, CircularProgress, Box } from "@mui/material";
import {
  markShipmentExportDeparted,
  updateShipmentStatus,
  getShipmentsByBoxIds,
} from "../../services/api.services";

interface Shipment {
  id: string;
}

interface BoxItem {
  id: string;
  shipments?: Shipment[];
}

interface ShipmentExport {
  status: string;
  boxes?: BoxItem[];
}

interface MarkExportDepartedButtonProps {
  exportId: string;
  disabled: boolean;
  onStatusUpdated: (newStatus: string) => void;
  onShipmentsRefreshed: (shipments: any[]) => void;
}

const MarkExportDepartedButton: React.FC<MarkExportDepartedButtonProps> = ({
  exportId,
  disabled,
  onStatusUpdated,
  onShipmentsRefreshed,
}) => {
  const [loading, setLoading] = useState(false);

  const handleMarkDeparted = async () => {
    try {
      setLoading(true);

      const updated: ShipmentExport = await markShipmentExportDeparted(exportId);
      onStatusUpdated(updated.status);

      if (updated.boxes) {
        const allShipments: Shipment[] = updated.boxes.flatMap(
          (box) => box.shipments ?? []
        );

        if (allShipments.length > 0) {
          await Promise.allSettled(
            allShipments.map((shipment) =>
              updateShipmentStatus(shipment.id, "DEPARTED")
            )
          );
        }

        const boxIds = updated.boxes.map((box) => box.id);
        const refreshedShipments = await getShipmentsByBoxIds(boxIds);

        onShipmentsRefreshed(refreshedShipments);
      }
    } catch (err) {
      console.error("Failed to update to departed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      disabled={loading || disabled}
      onClick={handleMarkDeparted}
      sx={{
        bgcolor: "#3b82f6",
        "&:hover": { bgcolor: "#2563eb" },
        textTransform: "none",
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={16} color="inherit" />
          Updating...
        </Box>
      ) : (
        "Update to Departed"
      )}
    </Button>
  );
};

export default MarkExportDepartedButton;