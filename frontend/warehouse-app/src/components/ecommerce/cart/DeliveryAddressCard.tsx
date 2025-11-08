"use client";

import React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import { DeliveryAddressCardProps } from "@/types/ecommerce";

export default function DeliveryAddressCard({
  recipientName,
  pincode,
  address,
  addressTypeLabel,
  changeLabel,
  onAddressTypeClick,
  onChangeClick,
}: DeliveryAddressCardProps) {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, 
        mb: 2, 
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "white",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Deliver to: {recipientName}, {pincode}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            {address}
          </Typography>
        </Box>
        <Button 
          size="small" 
          variant="outlined" 
          color="primary"
          onClick={onAddressTypeClick}
          sx={{ 
            textTransform: "none",
            ml: 2,
            minWidth: 70,
            borderColor: "primary.main",
          }}
        >
          {addressTypeLabel}
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button 
          size="small" 
          onClick={onChangeClick}
          sx={{ 
            color: "primary.main", 
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          {changeLabel}
        </Button>
      </Box>
    </Paper>
  );
}

