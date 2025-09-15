'use client';
import React, { useEffect, useState } from 'react';
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
import { getCourierCompanies, getCurrencies, updatePreferences } from '@/lib/api.service';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileData {
  identifier: string;
  name: string;
  email: string;
  contact: string;
  alternativeContact: string;
  gender: string;
}

interface PreferencesData {
  currency_id: string;
  courier_id: string;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileData: ProfileData;
}

export default function EditProfileModal({ open, onClose, profileData }: EditProfileModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(profileData);
  const [preferencesFormData, setPreferencesFormData] = useState<PreferencesData>({courier_id: "", currency_id: ""});
  const [courierCompanies, setCourierCompanies] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);


  const fetchCourierCompanies = async () => {
    const [courierCompaniesData, currenciesData] = await Promise.all([getCourierCompanies(), getCurrencies()]);
    setCourierCompanies(courierCompaniesData);
    setCurrencies(currenciesData);
  };  

  useEffect(() => {
    fetchCourierCompanies();
  }, []);

  const handleChange = (field: keyof ProfileData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleChangePreferences = (field: keyof PreferencesData) => (event: any) => {
    setPreferencesFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    //TOD0:P1: Remaning details save in user table like name, passport, contactNo, alternateContactNo, gender, dob
    //TOD0:P2: Save preferences in user_preferences table like courier, currency
    console.log('Saving profile data:', formData);
    updatePreferences({...preferencesFormData, user_id: user?.id});
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pb: 2 }}>
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
            onChange={() => { }}
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

        <Typography variant="h6" pb={2} sx={{ fontWeight: 600 }}>
          Preferences
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
           <FormControl fullWidth size="medium">
            <InputLabel>Courier</InputLabel>
            <Select
              onChange={handleChangePreferences('courier_id')}
              label="Courier"
              sx={{
                borderRadius: '8px',
              }}
            >
              {courierCompanies?.map((courier: any) => (
                <MenuItem key={courier.id} value={courier.id}>{courier.name}, {courier.address}, {courier.country}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="medium">
            <InputLabel>Currency</InputLabel>
            <Select
              onChange={handleChangePreferences('currency_id')}
              label="Currency"
              sx={{
                borderRadius: '8px',
              }}
            >
              {currencies?.map((currency: any) => (
                <MenuItem key={currency.id} value={currency.id}>{currency.currency_symbol}</MenuItem>
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}