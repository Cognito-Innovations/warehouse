"use client";

import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { PaymentOffersCardProps } from "@/types/ecommerce";

export default function PaymentOffersCard({
  title,
  offers,
  paymentMethod,
  borderColor,
}: PaymentOffersCardProps) {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, 
        mb: 2, 
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>
      
      {offers.map((offer, index) => (
        <Box key={index}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Box>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                {offer.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                {offer.description}
              </Typography>
            </Box>
            {paymentMethod && (
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {paymentMethod}
              </Typography>
            )}
          </Box>
          
          {offer.note && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
              {offer.note}
            </Typography>
          )}
        </Box>
      ))}
    </Paper>
  );
}

