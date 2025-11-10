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
      <Toolbar 
        sx={{ 
          justifyContent: "space-between", 
          gap: { xs: 1, sm: 2 }, 
          flexWrap: { xs: "wrap", md: "nowrap" }, 
          py: { xs: 2, sm: 2.5, md: 3 },
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: { xs: "64px", sm: "72px", md: "80px" },
        }}
      >
        {/* Brand Name */}
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          color="primary" 
          sx={{ 
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            flexShrink: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {brandName}
        </Typography>

        {/* Search Bar - Centered and Spacious */}
        <Box 
          sx={{ 
            flex: 1, 
            order: { xs: 3, md: 2 }, 
            width: { xs: "100%", md: "auto" }, 
            maxWidth: { xs: "100%", sm: "450px", md: "600px" }, 
            mx: { xs: 0, sm: 3, md: 4 },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: ecommerceData.ui.spacing.searchBorderRadius,
                bgcolor: ecommerceData.ui.colors.searchBackground,
                "& fieldset": { border: "none" },
                height: { xs: "44px", sm: "48px" },
                fontSize: { xs: "0.9375rem", sm: "1rem" },
              },
            }}
          />
        </Box>

        {/* Location and Cart - Right Side */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: { xs: 0.5, sm: 1 },
            order: { xs: 2, md: 3 },
            flexShrink: 0,
          }}
        >
          <IconButton 
            color="inherit" 
            size="small"
            sx={{ 
              display: { xs: "none", sm: "flex" },
              color: "text.secondary",
            }}
          >
            <LocationOn fontSize="small" />
          </IconButton>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              display: { xs: "none", md: "block" },
              fontSize: "0.875rem",
            }}
          >
            {city}, {pincode}
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={onCartClick}
            sx={{ 
              color: "text.primary",
              ml: { xs: 0.5, sm: 1 },
            }}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

