"use client";

import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { CartHeaderProps } from "@/types/ecommerce";

export default function CartHeader({ title, itemCount, onBackClick }: CartHeaderProps) {
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
          onClick={onBackClick}
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
          {title}
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

