import React from "react";
import {
  CircularProgress,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

import { removeShipmentFromBox } from "../../services/api.services";
import { formatDateTime } from "../../utils/formatDateTime";
import type { Shipment } from "../../types";

interface BoxShipmentsTableBodyProps {
  boxId: string;
  shipments: Shipment[];
  isLoading: boolean;
  isDeparted: boolean;
  onShipmentRemoved: (shipmentId: string) => void;
}

const BoxShipmentsTableBody: React.FC<BoxShipmentsTableBodyProps> = ({
  boxId,
  shipments,
  isLoading,
  isDeparted,
  onShipmentRemoved,
}) => {
  const handleDeleteShipment = async (shipmentId: string) => {
    if (!boxId || isDeparted) return;

    try {
      await removeShipmentFromBox(boxId, shipmentId);
      onShipmentRemoved(shipmentId);
    } catch (error) {
      console.error("Failed to delete shipment from box:", error);
    }
  };

  return (
    <TableBody>
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Loading shipments...
            </Typography>
          </TableCell>
        </TableRow>
      ) : shipments.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No shipments found
            </Typography>
          </TableCell>
        </TableRow>
      ) : (
        shipments.map((pkg) => (
          <TableRow key={pkg.id}>
            <TableCell>{pkg.shipment_no}</TableCell>

            <TableCell>
              <Typography fontWeight={500}>
                {pkg.tracking_no}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography fontWeight={500}>
                {pkg.user.name}
              </Typography>
            </TableCell>

            <TableCell>
              <Typography fontWeight={500}>
                {formatDateTime(pkg.updated_at)}
              </Typography>
            </TableCell>

            <TableCell align="center">
              <IconButton
                sx={{
                  bgcolor: "#f87171",
                  color: "white",
                  "&:hover": { bgcolor: "#ef4444" },
                }}
                size="small"
                onClick={() => handleDeleteShipment(pkg.id)}
                disabled={isDeparted}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  );
};

export default BoxShipmentsTableBody;