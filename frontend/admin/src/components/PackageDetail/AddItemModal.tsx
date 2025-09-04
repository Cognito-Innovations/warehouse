import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

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
  onInputChange
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
        pb: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
          {editingItem ? 'Edit Item' : 'Add Item'}
        </Typography>
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
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="Enter item name"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Quantity
              </Typography>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => onInputChange('quantity', parseInt(e.target.value) || 1)}
                min="1"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Amount
              </Typography>
              <input
                type="text"
                value={newItem.amount}
                onChange={(e) => onInputChange('amount', e.target.value)}
                placeholder="$0.00"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Total
            </Typography>
            <input
              type="text"
              value={newItem.total}
              readOnly
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#f9fafb',
                color: '#6b7280'
              }}
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
          disabled={!newItem.name || !newItem.amount}
          sx={{
            bgcolor: '#3b82f6',
            '&:hover': { bgcolor: '#2563eb' },
            textTransform: 'none',
            borderRadius: 1,
            px: 3
          }}
        >
          {editingItem ? 'Update' : 'Add'} Item
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemModal;
