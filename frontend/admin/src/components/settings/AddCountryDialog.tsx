import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface AddCountryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (country: { name: string; code: string }) => void;
}

const AddCountryDialog: React.FC<AddCountryDialogProps> = ({ open, onClose, onSave }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const country = {
      name: formData.get('countryName') as string,
      code: formData.get('countryCode') as string,
    };
    onSave(country);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>Add New Country</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="countryName"
            name="countryName"
            label="Country Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            id="countryCode"
            name="countryCode"
            label="ISO Code (e.g., US)"
            type="text"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCountryDialog;