import React from "react";
import {
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import BoxShipmentsTableBody from "./BoxShipmentsTableBody";
import { BOX_SHIPMENTS_TABLE_HEADERS } from "../../utils/constants";
import type { Shipment } from "../../types";

interface BoxShipmentsListProps {
  boxId: string;
  refreshShipments: () => void;
  boxLabel?: string; 
  boxIndex: number;
  totalBoxes: number;
  shipments: Shipment[];
  isLoading: boolean;
  isDeparted: boolean;
}

const BoxShipmentsList: React.FC<BoxShipmentsListProps> = ({
  boxId,
  refreshShipments,
  boxIndex,
  totalBoxes,
  boxLabel,
  shipments,
  isLoading,
  isDeparted,
}) => {
  const displayLabel = boxLabel 
    ? boxLabel 
    : totalBoxes === 1 
      ? "Box 1" 
      : `Box ${boxIndex + 1}`;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ mb: 1.5, color: "text.primary" }}
      >
        {displayLabel} Shipments
      </Typography>

      <Box
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "white",
          width: "100%"
        }}
      >
        <Table size="small" sx={{ width: "100%" }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#f9fafb",
                "& th": {
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                },
              }}
            >
              {BOX_SHIPMENTS_TABLE_HEADERS.map((header, index) => (
                <TableCell key={index} align={header.align}>
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <BoxShipmentsTableBody
            boxId={boxId}
            shipments={shipments}
            isLoading={isLoading}
            isDeparted={isDeparted}
            refreshShipments={refreshShipments}
          />
        </Table>
      </Box>
    </Box>
  );
};

export default BoxShipmentsList;