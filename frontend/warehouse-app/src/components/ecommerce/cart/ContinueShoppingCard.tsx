"use client";

import React, { useCallback } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/utils/constants";

export default function ContinueShoppingCard() {
  const router = useRouter();

  const handleContinueShopping = useCallback(() => {
    router.push(ROUTES.ECOMMERCE);
  }, [router]);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        border: `1px solid #e0e0e0`,
        bgcolor: "white",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={handleContinueShopping}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
          Continue Shopping
        </Typography>
        <ArrowForward sx={{ color: "primary.main" }} />
      </Box>
    </Paper>
  );
}

