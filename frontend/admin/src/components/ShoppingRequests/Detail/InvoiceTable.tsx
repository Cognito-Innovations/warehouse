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

export default function InvoiceTable({
  invoice,
  payment_slips,
  status,
  isApprovingPayment,
  onApprovePayment,
  onStatusUpdated,
}: {
  id: string;
  invoice: InvoiceDetails;
  payment_slips: string[];
  status: string;
  isApprovingPayment: boolean;
  onApprovePayment: () => void;
  onStatusUpdated: () => void;
}) {
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

        {status === "Payment Pending" && (
          <Button
            variant="contained"
            size="small"
            onClick={onApprovePayment}
            disabled={isApprovingPayment}
          >
            {isApprovingPayment ? "Approving..." : "Approve Payment"}
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
