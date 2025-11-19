"use client";

import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { ContinueShoppingCardProps } from "@/types/ecommerce";

export default function ContinueShoppingCard({
  label,
  onClick,
  borderColor,
}: ContinueShoppingCardProps) {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <ArrowForward sx={{ color: "primary.main" }} />
      </Box>
    </Paper>
  );
}

