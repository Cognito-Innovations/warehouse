"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";
import { DeliveryBannerProps } from "@/types/ecommerce";

export default function DeliveryBanner({ text, icon }: DeliveryBannerProps) {
  return (
    <Box
      sx={{
        bgcolor: "error.main",
        color: "white",
        py: 1.5,
        px: 2,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {icon || <RocketLaunch sx={{ fontSize: 18 }} />}
      <Typography variant="body2" fontWeight="bold">
        {text}
      </Typography>
    </Box>
  );
}

