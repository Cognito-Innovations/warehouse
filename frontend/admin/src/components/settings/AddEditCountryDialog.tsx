import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import type { Country, CreateCountryPayload } from '../../types';


interface AddEditCountryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (country: CreateCountryPayload) => void;
  saving?: boolean;
  initialData?: Country | null;
}

const emptyForm: CreateCountryPayload = { name: '', code: '', phone_code: '', image: '' };

const AddEditCountryDialog: React.FC<AddEditCountryDialogProps> = ({ open, onClose, onSave, saving, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const isEditing = !!initialData;

  useEffect(() => {
    if (isEditing && open) {
      setForm({
        name: initialData.name || '',
        code: initialData.code || '',
        phone_code: initialData.phone_code || '',
        image: initialData.image || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>{isEditing ? 'Edit Country' : 'Add New Country'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField autoFocus required margin="dense" name="name" label="Country Name" fullWidth value={form.name} onChange={handleChange} />
          <TextField required margin="dense" name="code" label="ISO Code (e.g., US)" fullWidth value={form.code} onChange={handleChange} />
          <TextField required margin="dense" name="phone_code" label="Phone Code (e.g., +1)" fullWidth value={form.phone_code} onChange={handleChange} />
          <TextField margin="dense" name="image" label="Image URL" type="url" fullWidth value={form.image} onChange={handleChange} />
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEditCountryDialog;