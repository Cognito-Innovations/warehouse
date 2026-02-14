import React from 'react';
import {
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ItemTableBody from './ItemTableBody';
import type { ItemDetail } from '../../types';

const ItemTable: React.FC<{ items: ItemDetail[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        bgcolor: '#f8fafc',
        borderRadius: 2,
        border: '1px dashed #d1d5db'
      }}>
        <Typography variant="body2" color="text.secondary">
          No item details to display.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      px: 6, 
      py: 2,
      bgcolor: '#f8fafc',
      borderRadius: 2,
      border: '1px solid #e2e8f0',
      mx: 2,
      my: 1
    }}>
      <Typography variant="subtitle2" sx={{ 
        fontWeight: 600, 
        color: '#374151',
        mb: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        Item Details
        <Typography variant="caption" sx={{ 
          bgcolor: '#e2e8f0', 
          color: '#374151',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontWeight: 500
        }}>
          {items.length} items
        </Typography>
      </Typography>
      
      <Box sx={{ 
        bgcolor: 'white', 
        borderRadius: 2, 
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ 
              bgcolor: '#f1f5f9',
              '& > *': { 
                border: 'none',
                fontWeight: 600,
                color: '#374151',
                py: 1.5
              }
            }}>
              <TableCell>Item Name</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <ItemTableBody items={items} />
        </Table>
      </Box>
    </Box>
  );
};

export default ItemTable;