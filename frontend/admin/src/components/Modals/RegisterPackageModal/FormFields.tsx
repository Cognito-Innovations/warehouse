import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { User, Rack, Supplier } from '../../../types';

interface FormFieldsProps {
  formData: {
    customer: string;
    rackSlot: string;
    vendor: string;
  };
  errors: { [key: string]: string };
  users: User[];
  racks: Rack[];
  suppliers: Supplier[];
  onInputChange: (field: string, value: string) => void;
  onAddSupplier: () => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  errors,
  users,
  racks,
  suppliers,
  onInputChange,
  onAddSupplier,
}) => {
  // Helper function to validate select values
  const getValidSelectValue = (value: string, options: any[], idField: string = 'id') => {
    return options.some(option => option[idField] === value) ? value : "";
  };
  return (
    <>
      {/* Customer Selection */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth required error={!!errors.customer}>
          <InputLabel>Select Customer</InputLabel>
          <Select
            value={getValidSelectValue(formData.customer, users)}
            label="Select Customer"
            onChange={(e) => onInputChange("customer", e.target.value)}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
          {errors.customer && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, ml: 1.75 }}
            >
              {errors.customer}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* Rack Slot */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth required error={!!errors.rackSlot}>
          <InputLabel>Rack Slot</InputLabel>
          <Select
            value={getValidSelectValue(formData.rackSlot, racks)}
            label="Rack Slot"
            onChange={(e) => onInputChange("rackSlot", e.target.value)}
          >
            {racks.map((rack) => (
              <MenuItem key={rack.id} value={rack.id}>
                {rack.label}
              </MenuItem>
            ))}
          </Select>
          {errors.rackSlot && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, ml: 1.75 }}
            >
              {errors.rackSlot}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* Reference Tracking */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          placeholder="Reference Tracking"
          value={formData.vendor || ""}
          onChange={(e) => onInputChange("vendor", e.target.value)}
          size="medium"
        />
      </Grid>

      {/* Select Vendor / Supplier */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl sx={{ minWidth: 200, flex: 1 }} error={!!errors.vendor}>
            <InputLabel>Select Vendor / Supplier</InputLabel>
            <Select
              value={getValidSelectValue(formData.vendor, suppliers)}
              label="Select Vendor / Supplier"
              onChange={(e) => onInputChange("vendor", e.target.value)}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}, {supplier.country}
                </MenuItem>
              ))}
            </Select>
            {errors.vendor && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.75 }}
              >
                {errors.vendor}
              </Typography>
            )}
          </FormControl>
          <Button
            variant="contained"
            onClick={onAddSupplier}
            sx={{
              borderRadius: "50%",
              minWidth: 40,
              width: 40,
              height: 40,
              p: 0,
              bgcolor: "#6366f1",
              "&:hover": { bgcolor: "#5b48d8" },
            }}
          >
            <AddIcon />
          </Button>
        </Box>
      </Grid>
    </>
  );
};

export default FormFields;
