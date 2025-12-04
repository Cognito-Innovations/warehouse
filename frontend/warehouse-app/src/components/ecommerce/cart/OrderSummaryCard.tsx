"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Paper, Box, Typography, Button, Divider, CircularProgress } from "@mui/material";
import { ArrowForward, Login } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/store/cartStore";
import { calculateCartTotals } from "@/utils/cartCalculations";
import { ROUTES } from "@/utils/constants";
import { OrderSummaryCardProps } from "@/types/ecommerce";

export default function OrderSummaryCard({
  userId,
  items,
  selectedCountry,
  selectedAddress,
  setHighlightAddressError,
  currencySymbol = "$",
}: OrderSummaryCardProps) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { checkoutProducts, cartProducts, isSyncing } = useCartStore();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const totals = calculateCartTotals(items, new Set(checkoutProducts), selectedCountry);
  
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
    } else {
      localStorage.setItem("checkoutSelectedItems", JSON.stringify(selected));
      router.push(ROUTES.CHECKOUT);
    }
  }, [router, cartProducts, userId, selectedAddress, checkoutProducts, isSyncing]); // ROUTES.CHECKOUT constant used directly
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        position: { md: "sticky", xs: "static" },
        top: { md: 20, xs: 0 },
        minWidth: { md: 320, xs: "auto" },
        border: `1px solid #e0e0e0`,
        bgcolor: "white",
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Order Summary
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currencySymbol}{(Number(totals.subtotal) || 0).toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Delivery Fee
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currencySymbol}{(Number(totals.deliveryFee) || 0).toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Taxes
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currencySymbol}{(Number(totals.taxes) || 0).toFixed(2)}
          </Typography>
        </Box>
        
        {totals.discount > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="body2" color="success.main">
              Discount
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight={500}>
              -{currencySymbol}{(Number(totals.discount) || 0).toFixed(2)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Service Charge
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currencySymbol}{(Number(totals.serviceCharge) || 0).toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Grand Total
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {currencySymbol}{(Number(totals.total) || 0).toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleCheckout}
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
          py: 1.75,
          borderRadius: 2,
          fontSize: "1rem",
          textTransform: "none",
          boxShadow: 2,
          "&:hover": {
            bgcolor: userId ? "#a5d6a7" : "primary.dark",
            boxShadow: 4,
          },
          "&.Mui-disabled": {
            bgcolor: "#e0e0e0",
            color: "#9e9e9e"
          }
        }}
      >
        {isSyncing ? "Syncing Cart..." : userId ? "Checkout" : "Login"}
      </Button>
    </Paper>
  );
}

