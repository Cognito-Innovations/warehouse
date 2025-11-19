"use client";

import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { EcommerceSearchBarProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";

export default function EcommerceSearchBar({
  searchQuery,
  placeholder,
  onSearchChange,
}: EcommerceSearchBarProps) {
  return (
    <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          sx: {
            borderRadius: ecommerceData.ui.spacing.searchBorderRadius,
            bgcolor: ecommerceData.ui.colors.searchBackground,
            "& fieldset": { border: "none" },
          },
        }}
      />
    </Box>
  );
}

