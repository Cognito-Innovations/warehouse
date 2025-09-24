import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, Box, CircularProgress, TextField } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { numberInputStyle } from '../../styles/numberInputStyle';

interface PackageItem {
  id: string;
  name: string;
  quantity: number;
  amount: string;
  total: string;
}

interface AddItemModalProps {
  open: boolean;
  editingItem: PackageItem | null;
  newItem: {
    name: string;
    quantity: number;
    amount: string;
    total: string;
  };
  loading: boolean;
  onClose: () => void;
  onSave: () => void;
  onInputChange: (field: string, value: string | number) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  open,
  editingItem,
  newItem,
  onClose,
  onSave,
  onInputChange,
  loading
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 2,
        fontWeight: 600,
        color: '#1e293b'
      }}>
        {editingItem ? 'Edit Item' : 'Add Item'}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Item Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              type="text"
              value={newItem.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="Enter item name"
              sx={{ backgroundColor: '#ffffff' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Quantity
              </Typography>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                type="number"
                value={newItem.quantity}
                onChange={(e) => onInputChange('quantity', parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
                sx={{
                  backgroundColor: '#ffffff',
                  ...numberInputStyle
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Amount
              </Typography>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                type="number"
                value={newItem.amount}
                onChange={(e) => onInputChange('amount', e.target.value)}
                placeholder="$0.00"
                sx={{
                  backgroundColor: '#ffffff',
                  ...numberInputStyle
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Total
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              type="text"
              value={newItem.total}
              InputProps={{
                readOnly: true,
              }}
              sx={{ backgroundColor: '#f9fafb' }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: 'none', borderRadius: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!newItem.name || !newItem.amount || loading}
          sx={{
            bgcolor: '#3b82f6',
            '&:hover': { bgcolor: '#2563eb' },
            textTransform: 'none',
            borderRadius: 1,
            px: 3
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            `${editingItem ? 'Update' : 'Add'} Item`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemModal;