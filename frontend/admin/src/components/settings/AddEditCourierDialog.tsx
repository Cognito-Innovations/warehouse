import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  type SelectChangeEvent,
} from '@mui/material';
import type { Country, Courier } from '../../types';

type CourierFormData = {
  name: string;
  address: string;
  phone_number: string;
  email: string;
  country_id: string;
};

interface AddEditCourierDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (courier: CourierFormData) => void;
  saving?: boolean;
  initialData?: Courier | null;
  countries: Pick<Country, 'id' | 'name'>[];
}

const emptyForm: CourierFormData = {
  name: '',
  address: '',
  phone_number: '',
  email: '',
  country_id: '',
};

const AddEditCourierDialog: React.FC<AddEditCourierDialogProps> = ({
  open,
  onClose,
  onSave,
  saving,
  initialData,
  countries,
}) => {
  const [form, setForm] = useState<CourierFormData>(emptyForm);
  const isEditing = React.useMemo(() => !!initialData, [initialData]);

  useEffect(() => {
    if (isEditing && open) {
      setForm({
        name: initialData?.name || '',
        address: initialData?.address || '',
        phone_number: initialData?.phone_number || '',
        email: initialData?.email || '',
        country_id: initialData?.country_id || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setForm({ ...form, country_id: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 600 }}>
        {isEditing ? 'Edit Courier' : 'Add New Courier'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            name="name"
            label="Courier Name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            name="address"
            label="Address"
            fullWidth
            multiline
            rows={3}
            value={form.address}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            name="phone_number"
            label="Phone Number"
            fullWidth
            value={form.phone_number}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              name="country_id"
              value={form.country_id}
              label="Country"
              onChange={handleSelectChange}
            >
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default AddEditCourierDialog;