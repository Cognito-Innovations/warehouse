import React from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { formatDateTime } from "../../utils/formatDateTime";

interface Package {
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
  shipments: Package[];
  isLoading: boolean;
  onDelete: (shipmentId: string) => void;
}

const BoxShipmentsList: React.FC<BoxShipmentsListProps> = ({
  boxId,
  shipments,
  isLoading,
  onDelete,
}) => {
  return (
    <Box sx={{ width: "130vh" }}>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ mb: 1.5, color: "text.primary" }}
      >
        Box {boxId} Shipments
      </Typography>

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Loading packages...
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
                  <TableCell>{pkg.id}</TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{pkg.trackingNo}</Typography>
                    <Typography variant="caption" color="text.secondary">{pkg.courier}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{pkg.customer}</Typography>
                    <Typography variant="caption" color="text.secondary">{pkg.customerCode}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{formatDateTime(pkg.date)}</Typography>
                    <Typography variant="caption" color="text.secondary">{pkg.time}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      sx={{
                        bgcolor: "#f87171",
                        color: "white",
                        "&:hover": { bgcolor: "#ef4444" },
                      }}
                      size="small"
                      onClick={() => onDelete(pkg.id)}
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