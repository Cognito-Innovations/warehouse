import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Box, Button, Typography, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { User, Rack, Supplier } from '../../../types';

interface FormFieldsProps {
  formData: {
    user: string;
    rackSlot: string;
    trackingNo: string;
    vendor: string;
  };
  errors: { [key: string]: string };
  users: User[];
  racks: Rack[];
  suppliers: Supplier[];
  onInputChange: (field: string, value: string) => void;
  onAddSupplier: () => void;
  usersLoading: boolean;
  racksLoading: boolean;
  suppliersLoading: boolean;
  onOpenUsers: () => void;
  onOpenRacks: () => void;
  onOpenSuppliers: () => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  errors,
  users,
  racks,
  suppliers,
  onInputChange,
  onAddSupplier,
  usersLoading,
  racksLoading,
  suppliersLoading,
  onOpenUsers,
  onOpenRacks,
  onOpenSuppliers,
}) => {
  // Helper function to validate select values
  const getValidSelectValue = <T extends { id: string }>(
    value: string, 
    options: T[],
  ): string => {
    return options.some(option => option.id === value) ? value : "";
  };
  return (
    <>
      {/* Customer Selection */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth required error={!!errors.user}>
          <InputLabel>Select Customer</InputLabel>
          <Select
            value={getValidSelectValue(formData.user, users)}
            label="Select Customer"
            onChange={(e) => onInputChange("user", e.target.value)}
            onOpen={onOpenUsers}
          >
            {users
              .filter((user) => user.role === 'user')
              .map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.suite_no})
              </MenuItem>
            ))}
            {usersLoading && (
              <MenuItem 
                disabled 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  py: 1 
                }}
              >
                <CircularProgress size={20} />
              </MenuItem>
            )}
          </Select>
          {errors.user && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, ml: 1.75 }}
            >
              {errors.user}
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
            onOpen={onOpenRacks}
          >
            {racks.map((rack) => (
              <MenuItem key={rack.id} value={rack.id}>
                {rack.label.toLowerCase()}
              </MenuItem>
            ))}
            {racksLoading && (
              <MenuItem 
                disabled 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  py: 1 
                }}
              >
                <CircularProgress size={20} />
              </MenuItem>
            )}
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
          value={formData.trackingNo || ""}
          onChange={(e) => {
            const value = e.target.value;
            // Allow any characters but limit to max 15
            if (value.length <= 15) {
              onInputChange("trackingNo", value);
            }
          }}
          size="medium"
          error={!!errors.trackingNo}
          helperText={errors.trackingNo}
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
              onOpen={onOpenSuppliers}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}, {supplier.country.name}
                </MenuItem>
              ))}
              {suppliersLoading && (
                <MenuItem 
                  disabled 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    py: 1 
                  }}
                >
                  <CircularProgress size={20} />
                </MenuItem>
              )}
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
