import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import InvoiceRow from "./InvoiceRow";

const InvoiceTable: React.FC<{ packageData: any }> = ({ packageData }) => {
  const invoice = {
    invoice_no: `INV/CN/${new Date().getFullYear()}/${packageData.id}`,
    amount: 36.50,
    total: 36.50,
    status: packageData.status === 'PAYMENT_PENDING' ? 'UNPAID' : 'PAID',
    items: packageData.items,
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight="600" mb={1.5}>
        Invoices
      </Typography>

      <TableContainer component={Paper} sx={{ border: '1px solid #e2e8f0' }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 600, bgcolor: '#f8fafc' } }}>
              <TableCell />
              <TableCell>Invoice No.</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <InvoiceRow invoice={invoice} />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InvoiceTable;