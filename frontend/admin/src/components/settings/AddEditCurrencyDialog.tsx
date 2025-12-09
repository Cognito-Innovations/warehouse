import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import type { CreateCurrencyPayload, Currency } from '../../types';

interface AddEditCurrencyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (currency: CreateCurrencyPayload) => void;
  saving?: boolean;
  initialData?: Currency | null;
}

const emptyForm = { name: '', currency_symbol: '', currency_code: '', rate: '' };

const AddEditCurrencyDialog: React.FC<AddEditCurrencyDialogProps> = ({ open, onClose, onSave, saving, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const isEditing = React.useMemo(() => !!initialData, [initialData]);

  useEffect(() => {
    if (isEditing && open) {
      setForm({
        name: initialData?.name || '',
        currency_symbol: initialData?.currency_symbol || '',
        currency_code: initialData?.currency_code || '',
        rate: initialData?.rate?.toString() || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: form.name,
      currency_symbol: form.currency_symbol,
      currency_code: form.currency_code,
      rate: parseFloat(form.rate),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>{isEditing ? 'Edit Currency' : 'Add New Currency'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField required margin="dense" name="name" label="Currency Name (e.g., US Dollar)" value={form.name} onChange={handleChange} fullWidth />
          <TextField required margin="dense" name="currency_symbol" label="Currency Symbol (e.g., $)" value={form.currency_symbol} onChange={handleChange} fullWidth />
          <TextField 
            required
            margin="dense"
            name="currency_code"
            label="Currency Code (ISO 4217, e.g., USD)"
            value={form.currency_code}
            onChange={handleChange}
            fullWidth
            inputProps={{ maxLength: 3 }}/>
          <TextField required margin="dense" name="rate" label="Rate" type="number" inputProps={{ step: "0.0001" }} value={form.rate} onChange={handleChange} fullWidth />
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

export default AddEditCurrencyDialog;