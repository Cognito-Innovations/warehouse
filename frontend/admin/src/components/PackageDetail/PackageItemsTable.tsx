import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export interface PackageItem {
  id: string;
  name: string;
  quantity: number;
  amount: string;
  total: string;
  unit_price: number;
  total_price: number;
}

interface PackageItemsTableProps {
  items: PackageItem[];
  isDiscarded: boolean;
  deletingItemId: string | null;
  onEdit: (item: PackageItem) => void;
  onDelete: (itemId: string) => void;
}

const PackageItemsTable: React.FC<PackageItemsTableProps> = ({
  items,
  isDiscarded,
  deletingItemId,
  onEdit,
  onDelete,
}) => {
  return (
    <TableContainer sx={{ bgcolor: "#ffffff", borderRadius: 2 }}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Quantity</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.875rem' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const isDeleting = deletingItemId === item.id;

            return (
              <TableRow key={item.id}>
                <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }} style={{ textTransform: 'capitalize' }}>
                  {item.name}
                </TableCell>
                <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>{item.quantity}</TableCell>
                <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>${item.amount || item.unit_price}</TableCell>
                <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>${item.total || item.total_price}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(item)}
                      disabled={isDiscarded || isDeleting}
                      sx={{
                        bgcolor: '#3b82f6',
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: '#2563eb' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(item.id)}
                      disabled={isDiscarded || isDeleting}
                      sx={{
                        bgcolor: '#f97316',
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: '#ea580c' }
                      }}
                    >
                      {isDeleting ? (
                        <CircularProgress size={20} sx={{ color: 'inherit' }} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PackageItemsTable;