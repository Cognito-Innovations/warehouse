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
} from "@mui/material";
import { InvoiceRow, type InvoiceDetails } from "./InvoiceRow";
import { updateShoppingRequestStatus } from "../../../services/api.services";
import { useState } from "react";

export default function InvoiceTable({
  id,
  invoice,
  payment_slips,
  status,
  onStatusUpdated,
}: {
  id: string;
  invoice: InvoiceDetails;
  payment_slips: string[];
  status: string;
  onStatusUpdated: () => void;
}) {
  const [approving, setApproving] = useState(false);

  const handleApprove = async () => {
    try {
      setApproving(true);
      await updateShoppingRequestStatus(id, "PAYMENT_APPROVED");
      onStatusUpdated();
    } catch (err) {
      console.error("Error approving payment:", err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Typography variant="h6" fontWeight="bold">
          Invoices
        </Typography>

        {status === "PAYMENT_PENDING" && (
          <Button
            variant="contained"
            size="small"
            onClick={handleApprove}
            disabled={approving}
          >
            {approving ? "Approving..." : "Approve Payment"}
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Invoice No.</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>GST</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              payment_slips={payment_slips}
              status={status}
              onStatusUpdated={onStatusUpdated}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
