import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface AddCurrencyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (currency: { name: string; code: string; symbol: string }) => void;
}

const AddCurrencyDialog: React.FC<AddCurrencyDialogProps> = ({ open, onClose, onSave }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currency = {
      name: formData.get('currencyName') as string,
      code: formData.get('currencyCode') as string,
      symbol: formData.get('currencySymbol') as string,
    };
    onSave(currency);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>Add New Currency</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField autoFocus required margin="dense" name="currencyName" label="Currency Name" fullWidth />
          <TextField required margin="dense" name="currencyCode" label="Code (e.g., USD)" fullWidth />
          <TextField required margin="dense" name="currencySymbol" label="Symbol (e.g., $)" fullWidth />
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCurrencyDialog;