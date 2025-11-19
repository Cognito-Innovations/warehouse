import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { InvoiceRow } from "./InvoiceRow";
import type { Invoice, PaymentSlip } from "./RequestDetailContent";

interface InvoiceTableProps {
  invoice: Invoice;
  payment_slips: PaymentSlip[];
  status: string;
  isApprovingPayment?: boolean;
  onApprovePayment?: () => void;
  isDiscarded?: boolean;
}

type StatusColor = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";

export default function InvoiceTable({
  invoice,
  payment_slips,
  status,
  isApprovingPayment,
  onApprovePayment,
  isDiscarded,
}: InvoiceTableProps) {
  
  const getStatusColor = (status: string): StatusColor => {
    switch (status) {
      case "PAYMENT_PENDING":
        return "warning";
      case "PAYMENT_APPROVED":
        return "success";
      case "UNPAID":
        return "error";
      case "PAID":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        p={2}
        sx={{
          bgcolor: "grey.50",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Invoice Details
          </Typography>
          <Chip
            label={status.replace("_", " ")}
            color={getStatusColor(status)}
            size="small"
            variant="outlined"
          />
        </Box>

        {status === "PAYMENT_PENDING" && (
          <Button
            variant="contained"
            size="medium"
            onClick={isDiscarded ? undefined : onApprovePayment}
            disabled={isDiscarded ||isApprovingPayment}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            {isApprovingPayment ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Approving...
              </Box>
            ) : (
              "Approve Payment"
            )}
          </Button>
        )}
      </Box>

      {/* Invoice Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 1,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 600, width: 50 }}>Details</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Invoice No.</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
              {/* 
              TODO: Add status column when functionality is implemented i.e for shipping its not working properly
              <TableCell sx={{ fontWeight: 600 }} align="center">Status</TableCell> 
              */}
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              payment_slips={payment_slips}
              status={status}
              isDiscarded={isDiscarded}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
