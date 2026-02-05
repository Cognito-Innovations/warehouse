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
        p: { xs: 1.5, sm: 2 }, 
        borderRadius: 2,
        border: `1px solid #e0e0e0`,
        bgcolor: "white",
        cursor: "pointer",
        flex: { xs: "1 1 auto", sm: "0 0 auto" },
        minWidth: { xs: "auto", sm: 180 },
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
      onClick={handleContinueShopping}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography 
          variant="body1" 
          color="text.primary" 
          sx={{ 
            fontWeight: 500,
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Back to Shopping
        </Typography>
        <ArrowForward sx={{ color: "primary.main", fontSize: { xs: 18, sm: 24 } }} />
      </Box>
    </Paper>
  );
}

