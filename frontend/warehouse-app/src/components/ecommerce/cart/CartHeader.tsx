"use client";

import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function CartHeader() {
  const router = useRouter();

  const { cartProductQuantityCount } = useCartStore();
  const itemCount = cartProductQuantityCount();

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: "white", 
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => router.back()}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ flexGrow: 1 }} 
          color="primary"
        >
          My Cart
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

