import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';

interface AddCountryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (country: { name: string; code: string; phone_code: string; image?: string }) => void;
  saving?: boolean;
}

const AddCountryDialog: React.FC<AddCountryDialogProps> = ({ open, onClose, onSave, saving }) => {
  const [form, setForm] = useState({ name: '', code: '', phone_code: '', image: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
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
            name="name"
            label="Country Name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            name="code"
            label="ISO Code (e.g., US)"
            fullWidth
            value={form.code}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            name="phone_code"
            label="Phone Code (e.g., +1)"
            fullWidth
            value={form.phone_code}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="url"
            fullWidth
            value={form.image}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCountryDialog;
