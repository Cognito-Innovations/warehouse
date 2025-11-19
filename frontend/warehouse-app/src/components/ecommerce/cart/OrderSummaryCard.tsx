"use client";

import React from "react";
import { Paper, Box, Typography, Button, Divider } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { OrderSummaryCardProps } from "@/types/ecommerce";

export default function OrderSummaryCard({
  subtotal,
  discount,
  deliveryFee,
  taxes,
  serviceCharge,
  total,
  checkoutLabel,
  onCheckout,
  borderColor,
  currencySymbol = "$",
}: OrderSummaryCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        position: { md: "sticky", xs: "static" },
        top: { md: 20, xs: 0 },
        minWidth: { md: 320, xs: "auto" },
        border: `1px solid ${borderColor}`,
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
            {currencySymbol}{(Number(subtotal) || 0).toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Delivery Fee
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currencySymbol}{(Number(deliveryFee) || 0).toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Taxes
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currencySymbol}{(Number(taxes) || 0).toFixed(2)}
          </Typography>
        </Box>
        
        {discount > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="body2" color="success.main">
              Discount
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight={500}>
              -{currencySymbol}{(Number(discount) || 0).toFixed(2)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Service Charge
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {currencySymbol}{(Number(serviceCharge) || 0).toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Grand Total
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {currencySymbol}{(Number(total) || 0).toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={onCheckout}
        endIcon={<ArrowForward />}
        sx={{
          bgcolor: "#c8e6c9",
          color: "text.primary",
          fontWeight: "bold",
          py: 1.75,
          borderRadius: 2,
          fontSize: "1rem",
          textTransform: "none",
          boxShadow: 2,
          "&:hover": {
            bgcolor: "#a5d6a7",
            boxShadow: 4,
          },
        }}
      >
        {checkoutLabel}
      </Button>
    </Paper>
  );
}

