import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

export interface InvoiceItem {
  name: string;
  quantity: number;
  amount: number;
  total: number;
}

interface InvoiceProductsProps {
  items?: InvoiceItem[];
}

const InvoiceProducts: React.FC<InvoiceProductsProps> = ({ items }) => {
  if (!items?.length) return null;

  return (
    <>
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
        Items in Package
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{item.amount}</TableCell>
              <TableCell align="right">{item.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default InvoiceProducts;