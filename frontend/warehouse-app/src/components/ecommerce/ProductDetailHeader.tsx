"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Badge } from "@mui/material";
import { ArrowBack, ShoppingCart, Share } from "@mui/icons-material";
import { ProductDetailHeaderProps } from "@/types/ecommerce";

export default function ProductDetailHeader({
  title,
  cartItemCount,
  onBackClick,
  onCartClick,
  onShareClick,
}: ProductDetailHeaderProps) {
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onBackClick}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }} color="primary">
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {onShareClick && (
            <IconButton color="inherit" onClick={onShareClick}>
              <Share />
            </IconButton>
          )}
          <IconButton color="inherit" onClick={onCartClick}>
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

