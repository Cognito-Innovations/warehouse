import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  Grid,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createSupplier, getCountries } from '../../../services/api.services';
import { toast } from 'sonner';

interface AddSupplierModalProps {
  open: boolean;
  onClose: () => void;
  onSupplierCreated?: () => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ open, onClose, onSupplierCreated }) => {
  const [formData, setFormData] = useState({
    country: '',
    supplier_name: '',
    contact_number: '',
    postal_code: '',
    address: '',
    website: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [countries, setCountries] = useState<Array<{ id: string; country: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      console.error('Failed to fetch countries', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCountries();
      // Reset form when modal opens
      setFormData({
        country: '',
        supplier_name: '',
        contact_number: '',
        postal_code: '',
        address: '',
        website: '',
      });
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: { [key: string]: string } = {};

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    if (!formData.supplier_name) {
      newErrors.supplier_name = 'Supplier name is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createSupplier(formData);
      toast.success('Supplier created successfully!');
      onSupplierCreated?.(); // Refresh the suppliers list
      onClose();
    } catch (err) {
      console.error('Failed to create supplier', err);
      toast.error('Failed to create supplier. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <Dialog
        open={open}
        onClose={isSubmitting ? undefined : onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography component="span" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          Add Supplier
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          {/* Select Country */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required error={!!errors.country}>
              <InputLabel>Select Country</InputLabel>
              <Select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                label="Select Country *"
                size="small"
                sx={{
                  "& .MuiSelect-select": {
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.country}
                  </MenuItem>
                ))}
              </Select>
              {errors.country && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.country}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Supplier Name"
              value={formData.supplier_name}
              onChange={(e) => handleInputChange('supplier_name', e.target.value)}
              error={!!errors.supplier_name}
              helperText={errors.supplier_name}
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: 40 },
              }}
            />
          </Grid>

          {/* Contact Number */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Contact Number"
              value={formData.contact_number}
              onChange={(e) => handleInputChange('contact_number', e.target.value)}
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: 40 },
              }}
            />
          </Grid>

          {/* Postal Code */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Postal Code"
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: 40 },
              }}
            />
          </Grid>

          {/* Address Line */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address Line"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              multiline
              rows={2}
              placeholder="Full Address line, eg, House Name, Street, Road"
              sx={{
                "& .MuiInputBase-root": {
                  minHeight: "60px",
                },
              }}
            />
          </Grid>

          {/* Website */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              size="small"
              sx={{
                "& .MuiInputBase-root": { height: 36 },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            bgcolor: "#8b5cf6",
            px: 4,
            "&:hover": { bgcolor: "#7c3aed" },
            "&:disabled": { bgcolor: "#d1d5db" },
          }}
        >
          {isSubmitting ? (
            <>
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  mr: 1,
                }}
              />
              Creating...
            </>
          ) : (
            "Create Supplier"
          )}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default AddSupplierModal;
