'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';

interface AddressData {
  contactPerson: string;
  contactNo: string;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
}

const countries = [
  'Indonesia',
  'South Korea',
  'United States',
  'United Kingdom',
  'Japan',
  'Singapore',
  'Malaysia',
  'Thailand',
];

export default function AddAddressModal({ open, onClose }: AddAddressModalProps) {
  const [formData, setFormData] = useState<AddressData>({
    contactPerson: '',
    contactNo: '',
    addressLine1: '',
    addressLine2: '',
    zipCode: '',
    city: '',
    state: '',
    country: 'Indonesia',
  });

  const handleChange = (field: keyof AddressData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving address data:', formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add / Edit Address
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Contact Person / Receiver Name / Business Name *"
            value={formData.contactPerson}
            onChange={handleChange('contactPerson')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="Contact No *"
            value={formData.contactNo}
            onChange={handleChange('contactNo')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="Address Line 1 *"
            value={formData.addressLine1}
            onChange={handleChange('addressLine1')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="Address Line 2"
            value={formData.addressLine2}
            onChange={handleChange('addressLine2')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="Zip Code"
            value={formData.zipCode}
            onChange={handleChange('zipCode')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="City"
            value={formData.city}
            onChange={handleChange('city')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="State"
            value={formData.state}
            onChange={handleChange('state')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <FormControl fullWidth size="medium">
            <InputLabel>Country *</InputLabel>
            <Select
              value={formData.country}
              onChange={handleChange('country')}
              label="Country *"
              sx={{
                borderRadius: '8px',
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            textTransform: 'none',
            borderRadius: '8px',
            px: 4,
            py: 1,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Add Address
        </Button>
      </DialogActions>
    </Dialog>
  );
}