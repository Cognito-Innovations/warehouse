import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CancelIcon from "@mui/icons-material/Cancel";
import PrintIcon from "@mui/icons-material/Print";
import InvoiceProducts from "./InvoiceProducts";
import InvoiceSlips from "./InvoiceSlips";

export interface InvoiceDetails {
  id: string;
  invoice_no: string;
  amount: number;
  gst: number;
  total: number;
  status: string;
  products?: { name: string; unit_price: number }[];
}

interface Props {
  invoice: InvoiceDetails;
  status: string;
  payment_slips: string[];
  onStatusUpdated: () => void;
}

export const InvoiceRow: React.FC<Props> = ({
  invoice,
  payment_slips,
}) => {
  const [open, setOpen] = useState(false);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "UNPAID":
        return { bgcolor: "warning.main", color: "white" };
      case "PAID":
        return { bgcolor: "success.main", color: "white" };
      default:
        return { bgcolor: "grey.400", color: "white" };
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{invoice.invoice_no}</TableCell>
        <TableCell>${Number(invoice.amount).toFixed(2)}</TableCell>
        <TableCell>{Number(invoice.gst).toFixed(2)}</TableCell>
        <TableCell>
          <strong>${Number(invoice.total).toFixed(2)}</strong>
        </TableCell>
        <TableCell>
          <Box
            component="span"
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: 600,
              ...getStatusStyles(invoice.status),
            }}
          >
            {invoice.status}
          </Box>
        </TableCell>
        <TableCell>
          <IconButton
            color="primary"
            onClick={() => window.print()}
          >
            <PrintIcon />
          </IconButton>
          <IconButton color="error">
            <CancelIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <InvoiceSlips slips={payment_slips} />
              <InvoiceProducts products={invoice.products} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
