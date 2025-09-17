import React, { useState } from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { addPackageToBox, searchReadyToShipPackage } from "../../services/api.services";

interface ShipmentActionsBarProps {
  selectedBoxId: number | null;
  onPackageAdded: () => void;
  hasShipments: boolean;
}

const ShipmentActionsBar: React.FC<ShipmentActionsBarProps> = ({ selectedBoxId, onPackageAdded, hasShipments }) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSearchAndAdd = async () => {
    if (!selectedBoxId || !trackingNumber.trim()) return;

    try {
      setError(null);
      const foundPackage = await searchReadyToShipPackage(trackingNumber.trim());
      if (foundPackage) {
        await addPackageToBox(selectedBoxId, foundPackage.id);
        onPackageAdded();
        setTrackingNumber("");
      }
    } catch (err: any) {
      console.error("Failed to add package:", err);
      setError(err.response?.data?.message || "Package not found or could not be added.");
    }
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
          placeholder="Search shipment"
          disabled={!selectedBoxId}
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          onKeyDown={handleKeyDown}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 410 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Only the shipments under tracking status (Ready to ship) can be added here
        </Typography>
      </Box>

      {selectedBoxId && hasShipments && (
        <Box sx={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: "auto" }}>
          <Button variant="contained" sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, textTransform: "none" }}>
            Update to Departed
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, textTransform: "none" }}>
            Export
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, textTransform: "none" }}>
            RB Export
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, textTransform: "none" }}>
            Packing List
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ShipmentActionsBar;