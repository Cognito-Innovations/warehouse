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
import CancelIcon from "@mui/icons-material/Cancel";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InvoiceProducts from "./InvoiceProducts";
import InvoiceSlips from "./InvoiceSlips";

export interface InvoiceDetails {
  id: string;
  invoice_no: string;
  amount: number;
  total: number;
  status: string;
  products?: { 
    id: string;
    name: string; 
    unit_price: number;
    quantity: number;
    currency?: string;
    description?: string;
  }[];
  created_at?: number;
  updated_at?: number;
}

interface Props {
  invoice: InvoiceDetails;
  status: string;
  payment_slips: any[];
  onStatusUpdated: () => void;
  isDiscarded: boolean;
}

export const InvoiceRow: React.FC<Props> = ({
  invoice,
  payment_slips,
  onStatusUpdated,
  isDiscarded,
}) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNPAID":
        return "error";
      case "PAID":
        return "success";
      case "PAYMENT_PENDING":
        return "warning";
      case "PAYMENT_APPROVED":
        return "success";
      default:
        return "default";
    }
  };


  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoice_no}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .invoice-details { margin-bottom: 20px; }
              .products-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .products-table th, .products-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .products-table th { background-color: #f2f2f2; }
              .total-section { margin-top: 20px; text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Invoice ${invoice.invoice_no}</h1>
            </div>
            <div class="invoice-details">
              <p><strong>Amount:</strong> ${(invoice.amount)}</p>
              <p><strong>Total:</strong> ${(invoice.total)}</p>
              <p><strong>Status:</strong> ${invoice.status}</p>
            </div>
            ${invoice.products && invoice.products.length > 0 ? `
              <table class="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.products.map(product => `
                    <tr>
                      <td>${product.name}</td>
                      <td>${product.quantity}</td>
                      <td>${(product.unit_price)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            ` : ""}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

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
                  handlePrint();
                }}
                disabled={isDiscarded} 
              >
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel Invoice">
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
            </Tooltip>
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
