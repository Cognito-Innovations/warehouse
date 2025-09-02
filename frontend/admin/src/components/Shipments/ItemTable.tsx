import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

interface ItemDetail {
  name: string;
  quantity: number;
  amount: string;
  total: string;
}

const ItemTable: React.FC<{ items: ItemDetail[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
        No item details to display.
      </Typography>
    );
  }

  return (
    <Box sx={{ px: 8, mt: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#f1f5f9' }}>
            <TableCell>Item Name</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((detail) => (
            <TableRow key={detail.name}>
              <TableCell>{detail.name}</TableCell>
              <TableCell align="center">{detail.quantity}</TableCell>
              <TableCell align="right">{detail.amount}</TableCell>
              <TableCell align="right">{detail.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ItemTable;