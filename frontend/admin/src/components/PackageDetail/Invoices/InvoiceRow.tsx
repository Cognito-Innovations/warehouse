import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Chip
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import InvoiceProducts, { type InvoiceItem } from "./InvoiceProducts";
import InvoiceSlips from "./InvoiceSlips";
import { toast } from 'sonner';

interface InvoiceDetails {
  invoice_no: string;
  amount: number;
  total: number;
  status: 'UNPAID' | 'PAID';
  items?: InvoiceItem[];
}

const InvoiceRow: React.FC<{ invoice: InvoiceDetails }> = ({ invoice }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{invoice.invoice_no}</TableCell>
        <TableCell align="right">${Number(invoice.amount).toFixed(2)}</TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>${Number(invoice.total).toFixed(2)}</TableCell>
        <TableCell align="center">
          <Chip 
            label={invoice.status} 
            size="small"
            color={invoice.status === 'UNPAID' ? 'warning' : 'success'}
            sx={{ fontWeight: 600, color: 'white' }}
          />
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" color="primary" onClick={() => toast.info("Print functionality coming soon!")}>
            <PrintIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => toast.error("Cancel functionality coming soon!")}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, padding: 2, backgroundColor: '#fafafa', borderRadius: 2 }}>
              <InvoiceSlips slips={[]} />
              <InvoiceProducts items={invoice.items} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default InvoiceRow;