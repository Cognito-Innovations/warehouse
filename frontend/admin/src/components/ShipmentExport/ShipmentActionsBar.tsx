import React, { useState } from "react";
import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { 
  addPackageToBox,
  markShipmentExportDeparted,
  searchReadyToShipPackage,
  updatePackageStatus,
} from "../../services/api.services";

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
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchAndAdd = async () => {
    if (!selectedBoxId || !trackingNumber.trim()) return;
    
    setIsSearching(true);
    setError(null);

    try {
      const foundPackage = await searchReadyToShipPackage(trackingNumber.trim());
      if (foundPackage) {
        await addPackageToBox(selectedBoxId, foundPackage.id);
        onPackageAdded();
        setTrackingNumber("");
      } else {
        setError("Package not found.");
      }
    } catch (err: any) {
      console.error("Failed to add package:", err);
      setError(err.response?.data?.message || "Package not found or could not be added.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpdateDeparted = async () => {
    try {
      setLoading(true);
      const updated = await markShipmentExportDeparted(exportId);
      onStatusUpdated(updated.status);

      if (updated.boxes) {
        const allPackages = updated.boxes.flatMap((box: any) => box.packages || []);
        if (allPackages.length > 0) {
          await Promise.allSettled(
            allPackages.map((pkg: any) =>
              updatePackageStatus(pkg.id, "Departed")
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
    setTrackingNumber(event.target.value);
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
          placeholder="Search tracking number"
          disabled={!selectedBoxId}
          value={trackingNumber}
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