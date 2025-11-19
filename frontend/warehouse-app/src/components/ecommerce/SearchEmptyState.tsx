"use client";
import React from "react";
import { Box, Alert, Button } from "@mui/material";

import { useProductActions, useProducts } from "@/store/ecommerceStore";

export default function SearchEmptyState() {
  const { searchQuery } = useProducts();
  const { setSearchQuery } = useProductActions();

  return (
    <Box sx={{ bgcolor: "white", px: 2, py: 4, textAlign: "center" }}>
      <Alert
        severity="info"
        sx={{ 
          maxWidth: 600, 
          mx: "auto", 
          justifyContent: "center",
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 1, sm: 0 },
          '& .MuiAlert-message': {
            mb: { xs: 1, sm: 0 },
            textAlign: 'center',
            width: { xs: '100%', sm: 'auto' },
          },
          '& .MuiAlert-action': {
            display: { xs: 'block', sm: 'flex' },
            mx: { xs: 'auto', sm: 0 },
          },
        }}
        action={
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSearchQuery("")}
            sx={{ 
              ml: { xs: 0, sm: 1 }, 
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '200px' },
              display: { xs: 'block', sm: 'inline-flex' },
              mx: { xs: 'auto', sm: 0 },
            }}
          >
            Clear Search
          </Button>
        }
      >
        No products found for &quot;{searchQuery}&quot;. Try different keywords.
      </Alert>
    </Box>
  );
}