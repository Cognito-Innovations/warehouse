import React from "react";
import { Box, Typography } from "@mui/material";

export const AssistedShoppingHero = () => {
  return (
    <Box sx={{ bgcolor: "primary.main", py: { xs: 4, md: 6 }, px: 2, textAlign: "center", color: "white" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2, fontSize: { xs: "1.75rem", md: "2.125rem" } }}>
        Buying Assistant
      </Typography>
      <Typography variant="h6" fontWeight={400} sx={{ mb: 1, fontSize: { xs: "1rem", md: "1.25rem" } }}>
        Found something you love at a store?
      </Typography>
      <Typography variant="h6" fontWeight={400} sx={{ mb: 3, fontSize: { xs: "1rem", md: "1.25rem" } }}>
        Let us buy it for you!
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}>
        Paste a product link from any store below and click "Search" to get started.
      </Typography>
    </Box>
  );
};