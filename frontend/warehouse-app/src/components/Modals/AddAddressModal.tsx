"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import {
  Close,
} from "@mui/icons-material";
import { createUserAddress } from "@/lib/api.service";
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

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
}

//TODO: These countries pull from db by loading in admin
const countries = [
  "Indonesia",
  "South Korea",
  "United States",
  "United Kingdom",
  "Japan",
  "Singapore",
  "Malaysia",
  "Thailand",
  "India"
];

export default function AddAddressModal({ open, onClose }: AddAddressModalProps) {
  const { data: session, status } = useSession();
  const user_id = (session?.user as any)?.user_id;
  const [formData, setFormData] = useState<AddressData>({
    name: "",
    address: "",
    zip_code: "",
    city: "",
    state: "",
    country: "",
  });

  const handleChange = (field: keyof AddressData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSave = () => {
    createUserAddress({...formData, user_id: user_id}).then(() => {
      toast.success("Address added successfully");
      onClose();
    }).catch((error) => {
      toast.error("Failed to add address");
      console.error("Error adding address:", error);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        pb: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add Address
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Contact Person / Receiver Name / Business Name *"
            value={formData.name}
            onChange={handleChange("name")}
            fullWidth
            size="medium"
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          
          <FormControl fullWidth size="medium">
            <InputLabel>Country *</InputLabel>
            <Select
              value={formData.country}
              onChange={handleChange("country")}
              label="Country *"
              sx={{
                borderRadius: "8px",
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
            bgcolor: "primary.main",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            px: 4,
            py: 1,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Add Address
        </Button>
      </DialogActions>
    </Dialog>
  );
}