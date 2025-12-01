"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Badge } from "@mui/material";
import { ArrowBack, ShoppingCart, Share } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";
import { ROUTES } from "@/utils/constants";
import { ProductDetailHeaderProps } from "@/types/ecommerce";

export default function ProductDetailHeader({ onShareClick }: ProductDetailHeaderProps) {
  const router = useRouter();
  const { cartProductQuantityCount } = useCartStore();

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => router.back()}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }} color="primary">
          Product Details
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {onShareClick && (
            <IconButton color="inherit" onClick={onShareClick}>
              <Share />
            </IconButton>
          )}
          <IconButton color="inherit" onClick={() => router.push(ROUTES.CART)}>
            <Badge badgeContent={cartProductQuantityCount()} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

