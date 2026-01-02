"use client";

import React, { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppBar, Toolbar, Typography, Box, IconButton, TextField, InputAdornment, Badge, Chip, CircularProgress } from "@mui/material";
import { ArrowBack, Search, ShoppingCart, Menu as MenuIcon, Share } from "@mui/icons-material";

import { useCartStore } from "@/store/cartStore";
import useProductStore from "@/store/productStore";
import { useAuth } from "@/contexts/AuthContext";
import { useAddressAPI } from "@/hooks/useAddressAPI";
import HeaderProfileTrigger from "../Header/HeaderProfileTrigger"; 
import HeaderProfileMenu from "../Header/HeaderProfileMenu";
import HeaderLocationMenu from "../Header/HeaderLocationMenu";
import AddAddressModal from "@/components/ecommerce/cart/AddAddressModal";
import { ROUTES } from "@/utils/constants";
import { createUserAddress } from "@/lib/api.service";
import { ecommerceData } from "@/data/ecommerceData";

interface HeaderProps {
  locationData?: any; 
  onMenuClick?: () => void;
  hideMenuButton?: boolean;
  hideSearch?: boolean;
  hideLocation?: boolean;
  itemCount?: number; 
  onShareClick?: () => void; 
  title?: string; 
}

export default function Header({
  locationData,
  onMenuClick,
  hideMenuButton = false,
  hideSearch = false,
  hideLocation = false,
  itemCount,
  onShareClick,
  title,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useProductStore();
  const { loading: cartLoading, cartProductQuantityCount } = useCartStore();
  
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState<null | HTMLElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const open = Boolean(anchorEl);
  const isLocationMenuOpen = Boolean(locationAnchorEl);

  const count = cartProductQuantityCount();

  const isEcommerce = (pathname === '/' || pathname.startsWith('/ecommerce')) && !['/ecommerce/orders', '/ecommerce/checkout', '/ecommerce/product', '/ecommerce/cart'].some(p => pathname.startsWith(p));
  const isOrders = pathname.startsWith('/ecommerce/orders');
  const isPickupRequest = pathname.startsWith('/dashboard/pickup-request');
  const isCheckout = pathname.startsWith('/ecommerce/checkout');
  const isProductDetail = pathname.startsWith('/ecommerce/product');
  const isCart = pathname.startsWith('/ecommerce/cart');
  const headerTitle = title || 
    (isEcommerce ? "Palakart" : 
      isOrders ? "My Orders" : 
      isCheckout ? "Checkout" : 
      isPickupRequest ? "Pickup Request" : 
      isProductDetail ? "Product Details" : "Palakart");

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const handleProfileClick = () => { router.push(ROUTES.PROFILE); handleProfileMenuClose(); };
  const handleLogoutClick = () => { logout(); handleProfileMenuClose(); };

  const handleLocationClick = (event: React.MouseEvent<HTMLElement>) => setLocationAnchorEl(event.currentTarget);
  const handleLocationClose = () => setLocationAnchorEl(null);
  const { selectedAddress, refreshUserPreferences } = useAddressAPI();

  const handleSaveAddress = useCallback(async (addressData: any) => {
    if (!user?.id || !locationData) return;
    try {
      const apiData = { user_id: user.id, ...addressData };
      await createUserAddress(apiData);
      await refreshUserPreferences();
      if (locationData.refreshAddresses) await locationData.refreshAddresses();
    } catch (err) {
      console.error("Failed to save address:", err);
    } finally {
      setShowAddAddressModal(false);
    }
  }, [user, locationData, refreshUserPreferences]);

  let locationText: string | null = null;
  let onLocationClick: (() => void) | null = null;
  let locationButtonText: string | null = null;

  if (!hideLocation && locationData) {
    if (!locationData.isLoggedIn) {
      locationButtonText = "Login";
      onLocationClick = () => {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        const callback = encodeURIComponent(returnTo);
        router.push(`/sign-in?callbackUrl=${callback}`);
      };
    } else {
      const validDefaultAddress = (locationData.address && locationData.address.city && locationData.address.zip_code) ? locationData.address : null;
      if (validDefaultAddress) {
        locationText = `${validDefaultAddress.city}, ${validDefaultAddress.zip_code}`;
      } else {
        locationButtonText = "Add Address";
        onLocationClick = () => setShowAddAddressModal(true);
      }
    }
  }

  const handleBack = () => {
    if (pathname.startsWith('/profile')) {
      const view = searchParams.get('view');
      if (view === 'country' || view === 'currency') {
        router.replace('/profile');
        return;
      }
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/ecommerce');
    }
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center", gap: { xs: 1, sm: 2 }, flexWrap: { xs: "wrap", md: "nowrap" }, py: { xs: 1.5, sm: 2, md: 2.5 }, px: { xs: 2, sm: 3, md: 4 }, minHeight: { xs: "64px", sm: "72px", md: "80px" } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            {isEcommerce && !hideMenuButton && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick} sx={{ mr: 0.5 }}>
                <MenuIcon />
              </IconButton>
            )}
            {!isEcommerce && (
              <IconButton color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
            )}
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }, letterSpacing: "-0.02em", cursor: "pointer" }}
              onClick={() => isEcommerce ? router.push("/") : handleBack()}
            >
              {headerTitle}
            </Typography>
          </Box>

          {isEcommerce && !hideSearch && (
            <Box sx={{ flexGrow: { md: 1 }, order: { xs: 3, md: 2 }, width: { xs: "100%", md: "auto" }, maxWidth: { xs: "100%", sm: "450px", md: "600px" }, mx: { xs: 0, sm: 3, md: 4 } }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="medium"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search sx={{ color: "text.secondary" }} /></InputAdornment>,
                  sx: { borderRadius: ecommerceData.ui.spacing.searchBorderRadius, bgcolor: ecommerceData.ui.colors.searchBackground, "& fieldset": { border: "none" }, height: { xs: "44px", sm: "48px" }, fontSize: { xs: "0.9375rem", sm: "1rem" } },
                }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, order: { xs: 2, md: 3 }, flexShrink: 0, ml: hideSearch ? 'auto' : 0 }}>
            {isEcommerce && (
              <>
                {!hideLocation && (
                  <HeaderProfileTrigger
                    currentUser={user}
                    open={open}
                    handleProfileMenuOpen={handleProfileMenuOpen}
                    handleLocationClick={handleLocationClick}
                    locationText={locationText}
                    locationButtonText={locationButtonText}
                    onLocationClick={onLocationClick}
                  />
                )}
                <IconButton color="inherit" onClick={() => router.push(ROUTES.CART)} sx={{ color: "text.primary", ml: 0 }}>
                  <Badge 
                    badgeContent={
                      hasMounted 
                        ? (cartLoading ? <CircularProgress size={10} sx={{ color: 'white' }} /> : count) 
                        : 0
                    } 
                    color="error"
                    invisible={!hasMounted && count === 0} 
                  >
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </>
            )}
            {isCheckout && itemCount && itemCount > 0 && (
              <Chip label={itemCount} size="small" color="primary" sx={{ height: 20, fontSize: "0.75rem", fontWeight: 600 }} />
            )}
            {isProductDetail && (
              <>
                {onShareClick && <IconButton color="inherit" onClick={onShareClick}><Share /></IconButton>}
                <IconButton color="inherit" onClick={() => router.push(ROUTES.CART)}>
                  <Badge badgeContent={hasMounted ? count : 0} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </>
            )}
            {isCart && count > 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {hasMounted ? count : 0} {hasMounted && count === 1 ? "item" : "items"}
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <HeaderProfileMenu currentUser={user} anchorEl={anchorEl} open={open} handleProfileMenuClose={handleProfileMenuClose} handleProfileClick={handleProfileClick} handleLogoutClick={handleLogoutClick} />
      <HeaderLocationMenu locationAnchorEl={locationAnchorEl} isLocationMenuOpen={isLocationMenuOpen} handleLocationClose={handleLocationClose} selectedAddress={selectedAddress} countryCode={selectedAddress?.country_code || ""} />
      <AddAddressModal open={showAddAddressModal} onClose={() => setShowAddAddressModal(false)} onSave={handleSaveAddress} title="Add Address" saveLabel="Save" cancelLabel="Cancel" />
    </>
  );
}