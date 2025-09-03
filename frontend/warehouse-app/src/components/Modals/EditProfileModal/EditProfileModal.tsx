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

interface ProfileData {
  identifier: string;
  name: string;
  email: string;
  contact: string;
  alternativeContact: string;
  gender: string;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileData: ProfileData;
}

export default function EditProfileModal({ open, onClose, profileData }: EditProfileModalProps) {
  const [formData, setFormData] = useState(profileData);

  const handleChange = (field: keyof ProfileData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile data:', formData);
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
          Edit Profile
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="ID Card / Passport No *"
            value={formData.identifier}
            onChange={handleChange('identifier')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="Name *"
            value={formData.name}
            onChange={handleChange('name')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="DOB"
            type="date"
            value=""
            onChange={() => {}}
            fullWidth
            size="medium"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="dd/mm/yyyy"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="Contact No"
            value={formData.contact}
            onChange={handleChange('contact')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <TextField
            label="Alternative Contact No"
            value={formData.alternativeContact}
            onChange={handleChange('alternativeContact')}
            fullWidth
            size="medium"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          
          <FormControl fullWidth size="medium">
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              onChange={handleChange('gender')}
              label="Gender"
              sx={{
                borderRadius: '8px',
              }}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}