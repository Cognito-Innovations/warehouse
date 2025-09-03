import React, { useEffect, useState } from 'react';
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
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { createPackage, getRacks, getSuppliers, getUsers} from '../../services/api.services';
import type { Rack, Supplier, User } from '../../types';

interface RegisterPackageModalProps {
  open: boolean;
  onClose: () => void;
}

const RegisterPackageModal: React.FC<RegisterPackageModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    customer: '',
    rackSlot: '',
    vendor: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    volumetricWeight: '',
    allowCustomerItems: false,
    shopInvoiceReceived: false,
    remarks: '',
  });

  const [users, setUsers] = useState<User[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchRacks = async () => {
    try {
      const data = await getRacks();
      setRacks(data);
    } catch (err) {
      console.error('Failed to fetch racks', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchRacks();
      fetchSuppliers();
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      const payload = {
        customer: formData.customer,
        rack_slot: formData.rackSlot,
        vendor: formData.vendor,
        weight: formData.weight,
        length: formData.length,
        width: formData.width,
        height: formData.height,
        volumetric_weight: formData.volumetricWeight,
        allow_customer_items: formData.allowCustomerItems,
        shop_invoice_received: formData.shopInvoiceReceived,
        remarks: formData.remarks,
      };

      await createPackage(payload);

      onClose();
    } catch (err) {
      console.error('Failed to register package', err);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Register Package
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Customer Selection */}
          <Grid size= {{xs: 12, sm:6 }}>
            <FormControl fullWidth required>
              <InputLabel>Select Customer</InputLabel>
              <Select
                value={formData.customer}
                label="Select Customer"
                onChange={(e) => handleInputChange('customer', e.target.value)}
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Rack Slot */}
          <Grid size= {{xs: 12, sm:6 }}>
            <FormControl fullWidth required>
              <InputLabel>Rack Slot</InputLabel>
              <Select
                value={formData.rackSlot}
                label="Rack Slot"
                onChange={(e) => handleInputChange('rackSlot', e.target.value)}
              >
                {racks.map(rack => (
                  <MenuItem key={rack.id} value={rack.id}>
                    {rack.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Reference Tracking */}
          <Grid size= {{xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Reference Tracking
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Select Vendor / Supplier</InputLabel>
                <Select
                  value={formData.vendor}
                  label="Select Vendor / Supplier"
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                >
                  {suppliers.map(supplier => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.supplier_name}, {supplier.country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ 
                  borderRadius: '50%',
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  p: 0,
                }}
              >
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Vendor tracking no. by store, amazon tracking
            </Typography>
          </Grid>

          {/* Weight Section */}
          <Grid size= {{xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Piece(s) Actual Weight and Volumetric Weight
            </Typography>
            <Grid container spacing={2}>
              <Grid size= {{xs: 12, sm:6 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Actual Weight
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Weight (KG)"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid size= {{xs: 12, sm:6 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Volumetric Weight
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Vol. Weight"
                  value={formData.volumetricWeight}
                  onChange={(e) => handleInputChange('volumetricWeight', e.target.value)}
                  size="small"
                  disabled
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size= {{xs: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Length (CM)"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid size= {{xs: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Width (CM)"
                  value={formData.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid size= {{xs: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Height (CM)"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Additional Options */}
          <Grid size= {{xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Add New Model
              </Button>
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.allowCustomerItems}
                  onChange={(e) => handleInputChange('allowCustomerItems', e.target.checked)}
                />
              }
              label="Allow customer to add items?"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.shopInvoiceReceived}
                  onChange={(e) => handleInputChange('shopInvoiceReceived', e.target.checked)}
                />
              }
              label="Shop Invoice Received?"
            />
          </Grid>

          {/* Remarks */}
          <Grid size= {{xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Remarks
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add remarks..."
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ 
            textTransform: 'none', 
            borderRadius: 2,
            bgcolor: '#6366f1',
            px: 4,
          }}
          onClick={handleSubmit}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterPackageModal;