"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface Offer {
  title: string;
  description: string;
}

interface OfferCardProps {
  offer: Offer;
  backgroundColor?: string;
  sx?: object;
}

export default function OfferCard({ 
  offer, 
  backgroundColor, 
  sx = {} 
}: OfferCardProps) {
  return (
    <Box
      sx={{
        ...sx,
        p: 2,
        borderRadius: 2,
        bgcolor: backgroundColor || "action.hover",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{
              color: "error.main",
              fontSize: "0.875rem",
              mb: 0.5,
            }}
          >
            {offer.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            {offer.description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}