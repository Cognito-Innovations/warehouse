"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, TextField, InputAdornment, Badge } from "@mui/material";
import { LocationOn, Search, ShoppingCart } from "@mui/icons-material";
import { EcommerceHeaderProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";

export default function EcommerceHeader({
  brandName,
  locationLabel,
  city,
  pincode,
  searchQuery,
  searchPlaceholder,
  onSearchChange,
  cartItemCount,
  onCartClick,
}: EcommerceHeaderProps) {
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
      <Toolbar sx={{ justifyContent: "space-around", gap: { xs: 1, sm: 2 }, flexWrap: { xs: "wrap", md: "nowrap" }, py: { xs: 1, sm: 1.5 } }} >
        <Typography variant="h4" fontWeight="bold" color="primary" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
          {brandName}
        </Typography>

        <Box sx={{ flex: 1, order: { xs: 3, md: 2 }, width: { xs: "100%", md: "auto" }, maxWidth: { xs: "100%", sm: "400px", md: "500px" }, mx: { xs: 0, sm: 2 }}}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, order: { xs: 2, md: 3 }}}>
          <IconButton color="inherit" size="small">
            <LocationOn />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            {locationLabel} {city}, {pincode}
          </Typography>
          <IconButton color="inherit" onClick={onCartClick} sx={{ order: { xs: 4, md: 4 } }}>
          <Badge badgeContent={cartItemCount} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

