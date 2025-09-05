import React from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface Shipment {
  id: string;
  trackingNo: string;
  courier: string;
  customer: string;
  customerCode: string;
  date: string;
  time: string;
}

interface BoxShipmentsListProps {
  boxId: number;
  shipments: Shipment[];
  onDelete: (shipmentId: string) => void;
}

const BoxShipmentsList: React.FC<BoxShipmentsListProps> = ({
  boxId,
  shipments,
  onDelete,
}) => {
  return (
    <Box sx={{ width: "130vh" }}>
      {/* Heading OUTSIDE the table card */}
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ mb: 1.5, color: "text.primary" }}
      >
        Box {boxId} Shipments
      </Typography>

      {/* Table wrapper with border + rounded corners */}
      <Box
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "white",
        }}
      >
        <Table size="small" sx={{ width: "130vh" }}>
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
              <TableCell>Shipment No.</TableCell>
              <TableCell>Tracking No.</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center" />
            </TableRow>
          </TableHead>

          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No shipments found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((s) => (
                <TableRow key={s.id}>
                  {/* Shipment No */}
                  <TableCell>{s.id}</TableCell>

                  {/* Tracking No + courier */}
                  <TableCell>
                    <Typography fontWeight={500}>{s.trackingNo}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.courier}
                    </Typography>
                  </TableCell>

                  {/* Customer + code */}
                  <TableCell>
                    <Typography fontWeight={500}>{s.customer}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.customerCode}
                    </Typography>
                  </TableCell>

                  {/* Date + time */}
                  <TableCell>
                    <Typography fontWeight={500}>{s.date}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.time}
                    </Typography>
                  </TableCell>

                  {/* Delete Button */}
                  <TableCell align="center">
                    <IconButton
                      sx={{
                        bgcolor: "#f87171", // red-400
                        color: "white",
                        "&:hover": { bgcolor: "#ef4444" }, // red-500
                      }}
                      size="small"
                      onClick={() => onDelete(s.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default BoxShipmentsList;