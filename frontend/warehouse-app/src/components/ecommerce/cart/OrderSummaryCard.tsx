"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Paper, Box, Typography, Button, Divider, CircularProgress, Chip } from "@mui/material";
import { ArrowForward, Login, ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/store/cartStore";
import { useDetectUserLocation } from "@/hooks/useEffectiveUserLocation";
import { calculateCartTotals } from "@/utils/cartCalculations";
import { formatPrice } from "@/utils/priceUtils";
import { ROUTES } from "@/utils/constants";
import { OrderSummaryCardProps, CartAddressData } from "@/types/ecommerce";

export default function OrderSummaryCard({
  userId,
  items,
  selectedCurrency,
  selectedAddress,
  setHighlightAddressError,
  selectedDeliveryOption,
  onBackToDelivery,
  onEditAddress,
}: OrderSummaryCardProps) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { checkoutProducts, cartProducts, isSyncing } = useCartStore();
  const { currencySymbol } = useDetectUserLocation();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Calculate delivery fee from selected option or fallback to item-based calculation
  const calculateDeliveryFee = () => {
    if (selectedDeliveryOption) {
      // Use selected delivery option fee
      // Note: This is per kg, so we need to calculate total weight
      // For now, use the option's total_amount as base fee
      return selectedDeliveryOption.total_amount;
    }
    // Fallback to item-based calculation
    const totals = calculateCartTotals(items, new Set(checkoutProducts), selectedCurrency, currencySymbol);
    return totals.deliveryFee;
  };

  const deliveryFee = calculateDeliveryFee();
  const totals = calculateCartTotals(items, new Set(checkoutProducts), selectedCurrency, currencySymbol);
  const finalTotal = totals.subtotal + deliveryFee;
  
  const handleCheckout = useCallback(() => {
    if (isSyncing) {
      toast.info("Syncing your cart with server, please wait...");
      return;
    }

    const selected = cartProducts.filter(item =>
      checkoutProducts.includes(item.product_id!)
    );

    if (selected?.length === 0) {
      toast.error("Please select items to checkout");
      return;
    }

    if (!userId) {
      localStorage.setItem("checkoutSelectedItems", JSON.stringify(selected));
      toast.info("Please sign in to continue with checkout");
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(ROUTES.CART)}`);
      return;
    } else if (!selectedAddress) {
      toast.error("Please add a delivery address to continue with checkout.");
      setHighlightAddressError(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setHighlightAddressError(false);
        timeoutRef.current = null;
      }, 3000);
    } else if (!selectedDeliveryOption) {
      toast.error("Please select a delivery option to continue with checkout.");
      return;
    } else {
      localStorage.setItem("checkoutSelectedItems", JSON.stringify(selected));
      router.push(ROUTES.CHECKOUT);
    }
  }, [router, cartProducts, userId, selectedAddress, selectedDeliveryOption, checkoutProducts, isSyncing, setHighlightAddressError]);
  
  const formatAddress = (address: CartAddressData) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.zip_code}`;
  };
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: { xs: 2, sm: 3 },
        position: { md: "sticky", xs: "static" },
        top: { md: 20, xs: 0 },
        minWidth: { md: 320, xs: "auto" },
        width: { xs: "100%", md: "auto" },
        border: `1px solid #e0e0e0`,
        bgcolor: "white",
        boxShadow: { xs: 1, md: 3 },
        mb: { xs: 2, md: 0 },
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        gutterBottom 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        Order Summary
      </Typography>

      {/* Delivery Address Section */}
      {selectedAddress && (
        <Box sx={{ mb: { xs: 2, sm: 3 }, pb: 2, borderBottom: "1px solid #e0e0e0" }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            mb: 1,
            flexWrap: "wrap",
            gap: 1,
          }}>
            <Typography 
              variant="body2" 
              fontWeight={600} 
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Deliver to:
            </Typography>
            {/* Address is read-only in Order Summary - removed Change button */}
            {/* Users must go back to previous steps to edit address */}
          </Box>
          <Box sx={{ 
            display: "flex", 
            alignItems: "flex-start", 
            gap: 1, 
            mb: 0.5,
            flexWrap: "wrap",
          }}>
            <Typography 
              variant="body1" 
              fontWeight={600}
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              {selectedAddress.name}
            </Typography>
            <Chip
              label="HOME"
              size="small"
              sx={{
                height: { xs: 18, sm: 20 },
                fontSize: { xs: "0.6rem", sm: "0.65rem" },
                bgcolor: "grey.100",
                color: "text.secondary",
              }}
            />
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 0.5,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              wordBreak: "break-word",
            }}
          >
            {formatAddress(selectedAddress)}
          </Typography>
          {selectedAddress.phone_number && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              {selectedAddress.phone_number}
            </Typography>
          )}
        </Box>
      )}
      
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
          </Typography>
          <Typography 
            variant="body2" 
            fontWeight={500}
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            {formatPrice(totals.subtotal, currencySymbol)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Box sx={{ flex: 1, pr: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Delivery Fee
            </Typography>
            {selectedDeliveryOption && (
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  display: "block", 
                  mt: 0.25,
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  wordBreak: "break-word",
                }}
              >
                {selectedDeliveryOption.service_name}
                {selectedDeliveryOption.estimated_days && ` • ${selectedDeliveryOption.estimated_days}`}
              </Typography>
            )}
          </Box>
          <Typography 
            variant="body2" 
            fontWeight={500}
            sx={{ 
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              whiteSpace: "nowrap",
              ml: 1,
            }}
          >
            {formatPrice(deliveryFee, currencySymbol)}
          </Typography>
        </Box>

        {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Taxes
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {formatPrice(totals.taxes, currencySymbol)}
          </Typography>
        </Box> */}
{/*         
        {totals.discount > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="body2" color="success.main">
              Discount
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight={500}>
              -{formatPrice(totals.discount, currencySymbol)}
            </Typography>
          </Box>
        )} */}

        {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Service Charge
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {formatPrice(totals.serviceCharge, currencySymbol)}
          </Typography>
        </Box> */}

        <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Grand Total
          </Typography>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="primary.main"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            {formatPrice(finalTotal, currencySymbol)}
          </Typography>
        </Box>
      </Box>

      {onBackToDelivery && (
        <Button
          fullWidth
          variant="outlined"
          size="medium"
          startIcon={<ArrowBack />}
          onClick={onBackToDelivery}
          sx={{
            mb: 2,
            textTransform: "none",
            color: "primary.main",
            borderColor: "primary.main",
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            "&:hover": {
              borderColor: "primary.dark",
              bgcolor: "primary.50",
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Return to Delivery
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Back
          </Box>
        </Button>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleCheckout}
        disabled={!selectedAddress || !selectedDeliveryOption}
        endIcon={
          isSyncing ? (
            <CircularProgress size={20} color="inherit" />
          ) : userId ? (
            <ArrowForward />
          ) : (
            <Login />
          )
        }
        sx={{
          bgcolor: userId ? "#c8e6c9" : "primary.main",
          color: userId ? "text.primary" : "white",
          fontWeight: "bold",
          py: { xs: 1.5, sm: 1.75 },
          borderRadius: 2,
          fontSize: { xs: "0.9rem", sm: "1rem" },
          textTransform: "none",
          boxShadow: { xs: 1, sm: 2 },
          "&:hover": {
            bgcolor: userId ? "#a5d6a7" : "primary.dark",
            boxShadow: { xs: 2, sm: 4 },
          },
          "&.Mui-disabled": {
            bgcolor: "#e0e0e0",
            color: "#9e9e9e"
          }
        }}
      >
        {isSyncing ? "Syncing Cart..." : userId ? "Proceed to Payment" : "Login"}
      </Button>
    </Paper>
  );
}

