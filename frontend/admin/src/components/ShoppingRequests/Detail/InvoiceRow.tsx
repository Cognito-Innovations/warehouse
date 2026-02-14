import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import CancelIcon from "@mui/icons-material/Cancel";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";

import InvoiceProducts from "./InvoiceProducts";
import InvoiceSlips from "./InvoiceSlips";
import type { Invoice, PaymentSlip } from "./RequestDetailContent";
import { printInvoice } from "./printInvoice";

interface InvoiceRowProps {
  invoice: Invoice;
  status: string;
  payment_slips: PaymentSlip[];
  isDiscarded?: boolean;
}

export const InvoiceRow: React.FC<InvoiceRowProps> = ({
  invoice,
  payment_slips,
  isDiscarded,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        sx={{ 
          "&:hover": { 
            bgcolor: "action.hover" 
          },
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            sx={{ 
              color: "primary.main",
              "&:hover": { 
                bgcolor: "primary.light",
                color: "white" 
              }
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 500 }}>
          {invoice.invoice_no}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 500 }}>
          {(invoice.amount)}
        </TableCell>
        <TableCell align="right">
          <Box component="span" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
            {(invoice.total)}
          </Box>
        </TableCell>
        {/* 
        TODO: Add status column when functionality is implemented i.e for shipping its not working properly
        <TableCell align="center">
          <Chip
            label={invoice.status.replace("_", " ")}
            color={getStatusColor(invoice.status) as any}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </TableCell> */}
        <TableCell align="center">
          <Box display="flex" gap={0.5} justifyContent="center">
            <Tooltip title="View Details">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
                disabled={isDiscarded} 
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print Invoice">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  printInvoice(invoice);
                }}
                disabled={isDiscarded} 
              >
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {/* TODO: Uncomment when functionality is implemented */}
            {/* <Tooltip title="Cancel Invoice">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle cancel logic
                }}
                disabled={isDiscarded} 
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box 
              sx={{ 
                p: 3,
                bgcolor: "grey.50",
                borderTop: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box display="flex" gap={3}>
                {/* Payment Slips Section */}
                <Box flex={1}>
                  <InvoiceSlips slips={payment_slips} />
                </Box>
                
                {/* Products Section */}
                <Box flex={1}>
                  <InvoiceProducts products={invoice.products} />
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
