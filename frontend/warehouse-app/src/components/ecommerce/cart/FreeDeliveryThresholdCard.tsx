"use client";

import React from "react";
import { Paper, Typography } from "@mui/material";
import { FreeDeliveryThresholdCardProps } from "@/types/ecommerce";

export default function FreeDeliveryThresholdCard({
  thresholdAmount,
  currentAmount,
  message,
  borderColor,
}: FreeDeliveryThresholdCardProps) {
  const remainingAmount = Math.max(0, thresholdAmount - currentAmount);
  const displayMessage = message.replace("{amount}", remainingAmount.toFixed(2));

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary" 
        textAlign="center"
        sx={{ fontSize: "0.875rem" }}
      >
        {displayMessage}
      </Typography>
    </Paper>
  );
}

