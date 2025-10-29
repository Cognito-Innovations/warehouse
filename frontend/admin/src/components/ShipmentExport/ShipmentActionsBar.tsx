import React, { useState } from "react";
import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { 
  addShipmentToBox,
  markShipmentExportDeparted,
  searchReadyToShipShipment,
  updateShipmentStatus,
} from "../../services/api.services";

interface Shipment {
  id: string;
  [key: string]: unknown;
}

interface BoxItem {
  id: string | number;
  shipments?: Shipment[];
}

interface ShipmentExport {
  status: string;
  boxes?: BoxItem[];
}

interface ShipmentActionsBarProps {
  selectedBoxId: number | null;
  onPackageAdded: () => void;
  hasShipments: boolean;
  exportId: string;
  status: string;
  onStatusUpdated: (newStatus: string) => void;
}

const ShipmentActionsBar: React.FC<ShipmentActionsBarProps> = ({
  selectedBoxId,
  onPackageAdded,
  hasShipments,
  exportId,
  status,
  onStatusUpdated,
}) => {
  const [shipmentNumber, setShipmentNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchAndAdd = async () => {
    if (!selectedBoxId || !shipmentNumber.trim()) return;
    
    setIsSearching(true);
    setError(null);

    try {
      const foundShipment = await searchReadyToShipShipment(shipmentNumber.trim());
      if (foundShipment) {
        await addShipmentToBox(selectedBoxId, foundShipment.id);
        onPackageAdded();
        setShipmentNumber("");
      } else {
        setError("Shipment not found.");
      }
    } catch (err) {
      const typedErr = err as { response?: { data?: { message?: string } } };
      console.error("Failed to add shipment:", err);
      setError(typedErr.response?.data?.message || "Shipment not found or could not be added.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpdateDeparted = async () => {
    try {
      setLoading(true);
      const updated: ShipmentExport = await markShipmentExportDeparted(exportId);
      onStatusUpdated(updated.status);

      if (updated.boxes) {
        const allShipments: Shipment[] = updated.boxes.flatMap((box) => box.shipments ?? []);
        if (allShipments.length > 0) {
          await Promise.allSettled(
            allShipments.map((shipment) =>
              updateShipmentStatus(shipment.id, "DEPARTED")
            )
          );
        }
      }
    } catch (err) {
      console.error("Failed to update to departed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShipmentNumber(event.target.value);
    if (error) setError(null);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchAndAdd();
    }
  };  

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search shipment number"
          disabled={!selectedBoxId}
          value={shipmentNumber}
          onChange={handleTrackingChange}
          onKeyDown={handleKeyDown}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              isSearching && (
                <InputAdornment position="end">
                  <CircularProgress color="inherit" size={20} />
                </InputAdornment>
              )
            )
          }}
          sx={{ width: 410 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Only the shipments under tracking status (Ready to ship) can be added here
        </Typography>
      </Box>

      {selectedBoxId && hasShipments && (
        <Box sx={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: "auto" }}>
          {status !== "SHIPMENTS DEPARTED" && (
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleUpdateDeparted}
              sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, textTransform: "none" }}
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
          )}
          {/* 
          TODO: Add functionality when it is implemented
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, textTransform: "none" }}>
            Export
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, textTransform: "none" }}>
            RB Export
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, textTransform: "none" }}>
            Packing List
          </Button> */}
        </Box>
      )}
    </Box>
  );
};

export default ShipmentActionsBar;