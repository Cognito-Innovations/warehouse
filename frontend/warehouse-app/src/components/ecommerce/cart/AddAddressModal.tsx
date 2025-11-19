"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { CartAddressData } from "@/types/ecommerce";
import { getCountries } from "@/lib/api.service";
import { getStatesForCountry, getCitiesForState } from "@/data/countryStatesCities";

export interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: Omit<CartAddressData, "id">) => Promise<void>;
  title: string;
  saveLabel: string;
  cancelLabel: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  phone_code: string;
}

export default function AddAddressModal({
  open,
  onClose,
  onSave,
  title,
  saveLabel,
  cancelLabel,
}: AddAddressModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    phone_number: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const PHONE_NUMBER_LENGTH = 10;

  const getSelectedCountry = (countryName: string): Country | undefined => {
    return countries.find((c) => c.name === countryName);
  };

  useEffect(() => {
    if (open) {
      loadCountries();
    }
  }, [open]);

  useEffect(() => {
    if (formData.country) {
      const states = getStatesForCountry(formData.country);
      setAvailableStates(states);
      if (states.length > 0 && !formData.state) {
        setFormData((prev) => ({ ...prev, state: states[0], city: "" }));
      }
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.country && formData.state) {
      const cities = getCitiesForState(formData.country, formData.state);
      setAvailableCities(cities);
      if (cities.length > 0 && !formData.city) {
        setFormData((prev) => ({ ...prev, city: cities[0] }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.country, formData.state]);

  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const countriesData = await getCountries();
      setCountries(Array.isArray(countriesData) ? countriesData : []);
    } catch (err) {
      console.error("Failed to load countries:", err);
    } finally {
      setLoadingCountries(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    const value = (e.target as HTMLInputElement).value as string;
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Handle dependent fields
      if (field === "country") {
        newData.state = "";
        newData.city = "";

        const selectedCountry = getSelectedCountry(value);
        if (selectedCountry && selectedCountry.phone_code) {
           newData.phone_number = selectedCountry.phone_code;
        }
      } else if (field === "state") {
        newData.city = "";
      }
      return newData;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip_code.trim()) newErrors.zip_code = "Zip code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (formData.phone_number) {
      const selectedCountry = getSelectedCountry(formData.country);
      
      if (selectedCountry) {
        const code = selectedCountry.phone_code;

        if (!formData.phone_number.startsWith(code)) {
          newErrors.phone_number = `Phone number must start with the country code (${code})`;
        } 
        else {
            const numberPart = formData.phone_number.slice(code.length);

            if (!/^[\d]+$/.test(numberPart)) {
                newErrors.phone_number = "Phone number must contain only digits after the code";
            }
            else if (numberPart.length !== PHONE_NUMBER_LENGTH) {
                newErrors.phone_number = `Phone number must be exactly ${PHONE_NUMBER_LENGTH} digits`;
            }
        }
      } else {
        if (!formData.country) {
          newErrors.phone_number = "Please select a country first";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Only send required fields to API
      const addressData: Omit<CartAddressData, "id"> = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        phone_number: formData.phone_number || undefined,
        email: formData.email || undefined,
      };
      await onSave(addressData);
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        phone_number: "",
        email: "",
      });
      setAvailableStates([]);
      setAvailableCities([]);
      setErrors({});
      onClose();
    } catch (err) {
      console.error("Failed to save address:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        phone_number: "",
        email: "",
      });
      setAvailableStates([]);
      setAvailableCities([]);
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
          />
          <TextField
            label="Address"
            value={formData.address}
            onChange={handleChange("address")}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            multiline
            rows={2}
            required
          />
          <FormControl fullWidth required error={!!errors.country}>
            <InputLabel>Country</InputLabel>
            <Select
              value={formData.country}
              onChange={handleChange("country")}
              label="Country"
              disabled={loadingCountries}
            >
              {loadingCountries ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading countries...
                </MenuItem>
              ) : (
                countries.map((country) => (
                  <MenuItem key={country.id} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.country && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.country}
              </Typography>
            )}
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            {availableStates.length > 0 ? (
              <FormControl fullWidth required error={!!errors.state}>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state}
                  onChange={handleChange("state")}
                  label="State"
                >
                  {availableStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
                {errors.state && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.state}
                  </Typography>
                )}
              </FormControl>
            ) : (
              <TextField
                label="State"
                value={formData.state}
                onChange={handleChange("state")}
                error={!!errors.state}
                helperText={errors.state}
                fullWidth
                required
              />
            )}

            {availableCities.length > 0 ? (
              <FormControl fullWidth required error={!!errors.city}>
                <InputLabel>City</InputLabel>
                <Select
                  value={formData.city}
                  onChange={handleChange("city")}
                  label="City"
                >
                  {availableCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
                {errors.city && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.city}
                  </Typography>
                )}
              </FormControl>
            ) : (
              <TextField
                label="City"
                value={formData.city}
                onChange={handleChange("city")}
                error={!!errors.city}
                helperText={errors.city}
                fullWidth
                required
              />
            )}
          </Box>

          <TextField
            label="Zip Code"
            value={formData.zip_code}
            onChange={handleChange("zip_code")}
            error={!!errors.zip_code}
            helperText={errors.zip_code}
            fullWidth
            required
          />
          <TextField
            label="Phone Number"
            value={formData.phone_number}
            onChange={handleChange("phone_number")}
            error={!!errors.phone_number}
            helperText={errors.phone_number}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading} sx={{ textTransform: "none" }}>
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : saveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

