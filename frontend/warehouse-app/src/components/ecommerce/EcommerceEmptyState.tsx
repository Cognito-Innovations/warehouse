"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { EcommerceEmptyStateProps } from "@/types/ecommerce";

export default function EcommerceEmptyState({ title, description }: EcommerceEmptyStateProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, px: 2 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {description}
      </Typography>
    </Box>
  );
}

