import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Download as DownloadIcon, Upload as UploadIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface PackageItem {
  id: string;
  name: string;
  quantity: number;
  amount: string;
  total: string;
}

interface PackageItemsSectionProps {
  packageItems: PackageItem[];
  onDownloadFormat: () => void;
  onBulkUpload: () => void;
  onOpenAddItemModal: () => void;
  onEditItem: (item: PackageItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const PackageItemsSection: React.FC<PackageItemsSectionProps> = ({ packageItems, onDownloadFormat, onBulkUpload, onOpenAddItemModal, onEditItem, onDeleteItem}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Package Items
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            size="small"
            onClick={onDownloadFormat}
            sx={{
              bgcolor: '#8b5cf6',
              '&:hover': { bgcolor: '#7c3aed' },
              textTransform: 'none',
              borderRadius: 1,
              color: 'white',
              borderColor: '#8b5cf6'
            }}
          >
            Download format
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            size="small"
            onClick={onBulkUpload}
            sx={{
              bgcolor: '#8b5cf6',
              '&:hover': { bgcolor: '#7c3aed' },
              textTransform: 'none',
              borderRadius: 1,
              color: 'white',
              borderColor: '#8b5cf6'
            }}
          >
            Bulk Upload
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={onOpenAddItemModal}
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
              textTransform: 'none',
              borderRadius: 1,
              px: 2,
              py: 1
            }}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{bgcolor: "#ffffff", borderRadius: 2}}>
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
            {packageItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>{item.name}</TableCell>
                <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>{item.quantity}</TableCell>
                <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>{item.amount}</TableCell>
                <TableCell sx={{ color: '#1e293b', fontSize: '0.875rem' }}>{item.total}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => onEditItem(item)}
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
                      onClick={() => onDeleteItem(item.id)}
                      sx={{
                        bgcolor: '#f97316',
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: '#ea580c' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PackageItemsSection;
