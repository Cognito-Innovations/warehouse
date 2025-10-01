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
import { removePackageFromBox } from "../../services/api.services";

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
  boxId: number | null;
  refreshPackages: () => void;
  boxLabel?: string; 
  boxIndex: number;
  totalBoxes: number;
  shipments: Package[];
  isLoading: boolean;
}

const BoxShipmentsList: React.FC<BoxShipmentsListProps> = ({
  boxId,
  refreshPackages,
  boxIndex,
  totalBoxes,
  boxLabel,
  shipments,
  isLoading,
}) => {

  const handleDeletePackage = async (packageId: string) => {
    if (!boxId) return;
    try {
      await removePackageFromBox(boxId, packageId);
      refreshPackages();
    } catch (error) {
      console.error("Failed to delete package from box:", error);
    }
  };

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
                  <TableCell>{pkg.shipment_id}</TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{pkg.tracking_no}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{pkg.user.name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{formatDateTime(pkg.updated_at)}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      sx={{
                        bgcolor: "#f87171",
                        color: "white",
                        "&:hover": { bgcolor: "#ef4444" },
                      }}
                      size="small"
                      onClick={() => handleDeletePackage(pkg.id)}
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