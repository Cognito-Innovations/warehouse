import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { 
  addShipmentToBox,
  getShipmentsByBoxIds,
  markShipmentExportDeparted,
  searchReadyToShipShipment,
  updateShipmentStatus,
} from "../../services/api.services";
import ExportButton from "./ExportButton";

interface Shipment {
  id: string;
  [key: string]: unknown;
}

interface BoxItem {
  id: string;
  shipments?: Shipment[];
}

interface ShipmentExport {
  status: string;
  boxes?: BoxItem[];
}

interface ShipmentActionsBarProps {
  selectedBoxId: string | null;
  onPackageAdded: () => void;
  exportId: string;
  status: string;
  onStatusUpdated: (newStatus: string) => void;
  selectedBoxShipments: any[];
  boxes?: BoxItem[];
}

const ShipmentActionsBar: React.FC<ShipmentActionsBarProps> = ({
  selectedBoxId,
  onPackageAdded,
  exportId,
  status,
  onStatusUpdated,
  selectedBoxShipments,
  boxes = [],
}) => {
  const [shipmentNumber, setShipmentNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allShipments, setAllShipments] = useState<any[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  const isDeparted = status === "SHIPMENTS DEPARTED";

  const loadAllShipments = useCallback(async () => {
    if (boxes.length > 0) {
      setExportLoading(true);
      try {
        const boxIds = boxes.map((box: BoxItem) => box.id);
        const shipments = await getShipmentsByBoxIds(boxIds);
        setAllShipments(shipments);
      } catch (error) {
        console.error('Error fetching all shipments for export:', error);
        setAllShipments([]);
      } finally {
        setExportLoading(false);
      }
    } else {
      setAllShipments([]);
    }
  }, [boxes]);

  useEffect(() => {
    loadAllShipments();
  }, [loadAllShipments]);

  const csvData = (isDeparted ? allShipments : selectedBoxShipments).map((shipment: any) => ({
    reference_number: shipment.tracking_no || '',
    weight: shipment.total_weight || '',
    description: shipment.packageItemNames?.join(', ') || '',
    customs_value_usd: shipment.customs_value || '',
    qty: shipment.packageItemNames?.length || 0,
    medium: 'air',
    receiver_name: shipment.user?.name || '',
    receiver_address: shipment.user?.preference?.courier?.address || '',
    receiver_location: shipment.country?.name || '',
    receiver_contact_number: `${shipment.user?.phone_code || ''} ${shipment.user?.phone_number || ''}`.trim(),
  }));

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

        const boxIds = updated.boxes.map((box: any) => box.id);
        const refreshedShipments = await getShipmentsByBoxIds(boxIds);
        setAllShipments(refreshedShipments);
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
      {!isDeparted ? (
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
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <ExportButton
            data={csvData}
            filename={`export_${exportId}_${new Date().toISOString().split('T')[0]}.xlsx`}
            disabled={csvData.length === 0}
            loading={exportLoading}
          />
          {csvData.length === 0 && !exportLoading && isDeparted && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              No shipments available for export.
            </Typography>
          )}
        </Box>
      )}

      {!isDeparted && (
        <Box sx={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: "auto" }}>
          <Button
            variant="contained"
            disabled={loading || allShipments.length === 0}
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
        </Box>
      )}
    </Box>
  );
};

export default ShipmentActionsBar;