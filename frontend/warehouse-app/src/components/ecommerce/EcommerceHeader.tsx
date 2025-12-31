"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Box, IconButton, TextField, InputAdornment, Badge, Button, CircularProgress } from "@mui/material";
import { LocationOn, Search, ShoppingCart, Menu as MenuIcon } from "@mui/icons-material";

import { useCartStore } from "@/store/cartStore";
import useProductStore from "@/store/productStore";
import { useAuth } from "@/contexts/AuthContext";
import AddAddressModal from "@/components/ecommerce/cart/AddAddressModal";
import { createUserAddress } from "@/lib/api.service";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";
import { EcommerceHeaderProps } from "@/types/ecommerce";

export default function EcommerceHeader({
  locationData,
  cartItemCount,
  onMenuClick,
  hideMenuButton = false,
  hideSearch = false,
  hideLocation = false,
}: EcommerceHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useProductStore();
  const { loading: cartLoading } = useCartStore();
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const handleSaveAddress = useCallback(async (addressData: any) => {
    if (!user?.id || !locationData) return;
    try {
      const apiData = {
        user_id: user.id,
        ...addressData,
      }
      await createUserAddress(apiData);
      if (locationData.refreshAddresses) {
        await locationData.refreshAddresses();
      }
    } catch (err) {
      console.error("Failed to save address:", err);
    } finally {
      setShowAddAddressModal(false);
    }
  }, [user, locationData]);

  let locationText: string | null = null;
  let onLocationClick: (() => void) | null = null;
  let locationButtonText: string | null = null;

  if (!hideLocation && locationData) {
    if (!locationData.isLoggedIn) {
      // Not logged in: Show Login button
      locationButtonText = "Login";
      onLocationClick = () => {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        const callback = encodeURIComponent(returnTo);
        router.push(`/sign-in?callbackUrl=${callback}`);
      };
    } else {
      // Logged in: (has city & zip_code)
      const validDefaultAddress = (locationData.address && locationData.address.city && locationData.address.zip_code)
        ? locationData.address
        : null;
      if (validDefaultAddress) {
        // Has valid address: Show default
        locationText = `${validDefaultAddress.city}, ${validDefaultAddress.zip_code}`;
      } else {
        // No valid address found: Show Add Address
        locationButtonText = "Add Address";
        onLocationClick = () => setShowAddAddressModal(true);
      }
    }
  }

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            flexWrap: { xs: "wrap", md: "nowrap" },
            py: { xs: 1.5, sm: 2, md: 2.5 },
            px: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: "64px", sm: "72px", md: "80px" },
          }}
        >
          {/* Logo and Menu Trigger Wrapper */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Menu Button */}
              {!hideMenuButton && (
                <IconButton 
                  edge="start" 
                  color="inherit" 
                  aria-label="menu" 
                  onClick={onMenuClick}
                  sx={{ mr: 0.5 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Brand Name */}
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                  flexShrink: 0,
                  letterSpacing: "-0.02em",
                  cursor: "pointer"
                }}
                onClick={() => router.push("/")}
              >
                Palakart
              </Typography>
          </Box>

          {/* Search Bar */}
          {!hideSearch && (
            <Box
              sx={{
                flexGrow: { md: 1 },
                order: { xs: 3, md: 2 },
                width: { xs: "100%", md: "auto" },
                maxWidth: { xs: "100%", sm: "450px", md: "600px" },
                mx: { xs: 0, sm: 3, md: 4 },
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          )}
          {/* Location and Cart - Right Side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              order: { xs: 2, md: 3 },
              flexShrink: 0,
              ml: hideSearch ? 'auto' : 0 
            }}
          >
            {!hideLocation && (
                locationText ? (
                  <>
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
                      {locationText}
                    </Typography>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={onLocationClick || undefined}
                    sx={{
                      display: { xs: "none", md: "block" },
                      textTransform: "none",
                      fontSize: "0.875rem",
                      color: "#6D28D9",
                      borderColor: "#6D28D9",
                      p: 0.5,
                      minWidth: "auto",
                      borderRadius: 1,
                      "&:hover": {
                        borderColor: "#5B21B6",
                        color: "#5B21B6",
                        bgcolor: "rgba(109, 40, 217, 0.04)",
                      },
                    }}
                  >
                    {locationButtonText}
                  </Button>
                )
            )}
            <IconButton
              color="inherit"
              onClick={() => router.push(ROUTES.CART)}
              sx={{
                color: "text.primary",
                ml: { xs: 0.5, sm: 1 },
              }}
            >
              <Badge 
                badgeContent={
                  cartLoading ? (
                    <CircularProgress size={10} sx={{ color: 'white' }} />
                  ) : (
                    cartItemCount
                  )
                } 
                color="error"
              >
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <AddAddressModal
        open={showAddAddressModal}
        onClose={() => setShowAddAddressModal(false)}
        onSave={handleSaveAddress}
        title="Add Address"
        saveLabel="Save"
        cancelLabel="Cancel"
      />
    </>
  );
}