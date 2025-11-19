"use client";

import React, { useEffect, useState } from "react";
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
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import {
  Close,
} from "@mui/icons-material";
import { createUserAddress, getCountries } from "@/lib/api.service";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface AddressData {
  name: string;
  address: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

interface Country {
  id: string;
  name: string;
}

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
}

export default function AddAddressModal({ open, onClose, onAddressAdded }: AddAddressModalProps) {
  const { data: session } = useSession();
  const user_id = (session?.user as any)?.user_id;

  const initialFormData = {
    name: "",
    address: "",
    zip_code: "",
    city: "",
    state: "",
    country: "",
  };

  const [formData, setFormData] = useState<AddressData>(initialFormData);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressData, string>>>({});
  
  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const data = await getCountries();
      setCountriesList(data);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      toast.error("Could not load the list of countries.");
    } finally {
      setIsLoadingCountries(false);
    }
  };

  useEffect(() => {
    if (open && countriesList.length === 0) {
      fetchCountries();
    }
  }, [open, countriesList.length]);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [open]);

  const handleChange = (field: keyof AddressData) => (event: any) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = "Receiver name is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.zip_code.trim()) newErrors.zip_code = "Zip code is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isSaving || !validateForm()) return;

    setIsSaving(true);
    try {
      await createUserAddress({ ...formData, user_id });
      toast.success("Address added successfully");
      onAddressAdded();
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    } finally {
      setIsSaving(false);
    };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: {borderRadius: "12px"} }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        p: 3,
        pb: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add Address
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <TextField
            label="Contact Person / Receiver Name / Business Name *"
            value={formData.name}
            onChange={handleChange("name")}
            fullWidth
            size="medium"
            error={!!errors.name}
            helperText={errors.name}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          
          <TextField
            label="Address"
            value={formData.address}
            onChange={handleChange("address")}
            fullWidth
            size="medium"
            error={!!errors.address}
            helperText={errors.address}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
      
          <TextField
            label="Zip Code"
            value={formData.zip_code}
            onChange={handleChange("zip_code")}
            fullWidth
            size="medium"
            error={!!errors.zip_code}
            helperText={errors.zip_code}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          
          <TextField
            label="City"
            value={formData.city}
            onChange={handleChange("city")}
            fullWidth
            size="medium"
            error={!!errors.city}
            helperText={errors.city}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          
          <TextField
            label="State"
            value={formData.state}
            onChange={handleChange("state")}
            fullWidth
            size="medium"
            error={!!errors.state}
            helperText={errors.state}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          
          <FormControl fullWidth size="medium" error={!!errors.country}>
            <InputLabel>Country *</InputLabel>
            <Select
              value={formData.country}
              onChange={handleChange("country")}
              label="Country *"
              sx={{
                borderRadius: "8px",
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 100,
                  },
                },
              }}
            >
              {isLoadingCountries && (
                <MenuItem disabled value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography>Loading countries...</Typography>
                  </Box>
                </MenuItem>
              )}
              
              {!isLoadingCountries && countriesList.map((country) => (
                <MenuItem key={country.id} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
            {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          fullWidth
          disabled={isSaving}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            px: 4,
            py: 1.5,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          {isSaving && <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />}
          {isSaving ? "Adding Address..." : "Add Address"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}