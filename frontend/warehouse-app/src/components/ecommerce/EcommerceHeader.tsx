"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Box, IconButton, TextField, InputAdornment, Badge, Button, CircularProgress, Avatar } from "@mui/material";
import { LocationOn, Search, ShoppingCart } from "@mui/icons-material";

import { useCartStore } from "@/store/cartStore";
import useProductStore from "@/store/productStore";
import { useAuth } from "@/contexts/AuthContext";
import AddAddressModal from "@/components/ecommerce/cart/AddAddressModal";
import { createUserAddress } from "@/lib/api.service";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";
import { EcommerceHeaderProps } from "@/types/ecommerce";
import { useAddressAPI } from "@/hooks/useAddressAPI";
import HeaderProfileTrigger from "../Header/HeaderProfileTrigger";
import HeaderProfileMenu from "../Header/HeaderProfileMenu";
import HeaderLocationMenu from "../Header/HeaderLocationMenu";


export default function EcommerceHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useProductStore();
  const { loading: cartLoading, cartProductQuantityCount } = useCartStore();
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const isLocationMenuOpen = Boolean(locationAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push(ROUTES.PROFILE);
    handleProfileMenuClose();
  };

  const handleLogoutClick = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleLocationClick = (event: React.MouseEvent<HTMLElement>) => {
    setLocationAnchorEl(event.currentTarget);
  };

  const handleLocationClose = () => {
    setLocationAnchorEl(null);
  };

  const { selectedAddress, refreshUserPreferences } = useAddressAPI();

  const handleSaveAddress = useCallback(async (addressData: any) => {
    if (!user?.id) return;
    try {
      const apiData = {
        user_id: user.id,
        ...addressData,
      }
      await createUserAddress(apiData);
      await refreshUserPreferences();
    } catch (err) {
      console.error("Failed to save address:", err);
    } finally {
      setShowAddAddressModal(false);
    }
  }, [user, refreshUserPreferences]);



  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
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
            onClick={() => router.push("/")}
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              flexShrink: 0,
              letterSpacing: "-0.02em",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8
              }
            }}
          >
            Palakart
          </Typography>
          {/* Search Bar - Centered and Spacious */}
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
          {/* Location and Cart - Right Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.25, sm: 0.5 }, order: { xs: 2, md: 3 }, flexShrink: 0, }}>
            <HeaderProfileTrigger
              currentUser={user}
              open={open}
              handleProfileMenuOpen={handleProfileMenuOpen}
              handleLocationClick={handleLocationClick}
            />

            <IconButton
              color="inherit"
              onClick={() => router.push(ROUTES.CART)}
              sx={{
                color: "text.primary",
                ml: 0,
              }}
            >
              <Badge
                badgeContent={
                  cartLoading ? (
                    <CircularProgress size={10} sx={{ color: 'white' }} />
                  ) : (
                    cartProductQuantityCount()
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

      <HeaderProfileMenu
        currentUser={user}
        anchorEl={anchorEl}
        open={open}
        handleProfileMenuClose={handleProfileMenuClose}
        handleProfileClick={handleProfileClick}
        handleLogoutClick={handleLogoutClick}
      />

      <HeaderLocationMenu
        locationAnchorEl={locationAnchorEl}
        isLocationMenuOpen={isLocationMenuOpen}
        handleLocationClose={handleLocationClose}
        selectedAddress={selectedAddress}
        countryCode={selectedAddress?.country_code || ""}
      />

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