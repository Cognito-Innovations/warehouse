import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { getCountries } from '../../services/api.services';

interface AddCurrencyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (currency: { country: string; currency_symbol: string; rate: number }) => void;
  saving?: boolean;
}

const AddCurrencyDialog: React.FC<AddCurrencyDialogProps> = ({ open, onClose, onSave, saving }) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [form, setForm] = useState({ country: '', currency_symbol: '', rate: '' });

  const fetchCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      console.error('Failed to fetch countries', err);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ country: form.country, currency_symbol: form.currency_symbol, rate: parseFloat(form.rate) });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 600 }}>Add New Currency</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            select
            required
            margin="dense"
            name="country"
            label="Country"
            value={form.country}
            onChange={handleChange}
            fullWidth
          >
            {countries.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            required
            margin="dense"
            name="currency_symbol"
            label="Currency Symbol (e.g., $)"
            value={form.currency_symbol}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            margin="dense"
            name="rate"
            label="Rate"
            type="number"
            value={form.rate}
            onChange={handleChange}
            fullWidth
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

export default AddCurrencyDialog;
