"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { getCountries } from "@/lib/api.service";
import { getUserCountry, setUserCountry, getCurrencyForCountry } from "@/utils/currency";

export interface LocationSelectorProps {
  onCountryChange?: (country: string) => void;
  borderColor: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
}

export default function LocationSelector({ onCountryChange, borderColor }: LocationSelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(getUserCountry());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    const currentCountry = getUserCountry();
    setSelectedCountry(currentCountry);
  }, []);

  const loadCountries = async () => {
    setLoading(true);
    try {
      const countriesData = await getCountries();
      setCountries(Array.isArray(countriesData) ? countriesData : []);
    } catch (err) {
      console.error("Failed to load countries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setUserCountry(country);
    if (onCountryChange) {
      onCountryChange(country);
    }
    // Note: Currency changes will be applied on next render via getUserCountry()
  };

  const currency = getCurrencyForCountry(selectedCountry);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <LocationOn sx={{ color: "primary.main" }} />
        <Typography variant="body2" fontWeight={500}>
          Location & Currency
        </Typography>
      </Box>
      <FormControl fullWidth size="small">
        <InputLabel>Select Country</InputLabel>
        <Select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          label="Select Country"
          disabled={loading}
        >
          {countries.map((country) => (
            <MenuItem key={country.id} value={country.name}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCountry && (
        <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Currency:
          </Typography>
          <Chip
            label={`${currency.code} (${currency.symbol})`}
            size="small"
            sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}
          />
        </Box>
      )}
    </Paper>
  );
}

