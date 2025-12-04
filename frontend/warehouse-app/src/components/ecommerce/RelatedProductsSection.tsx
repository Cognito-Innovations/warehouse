"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { EcommerceProduct } from "@/types/ecommerce";
import EcommerceProductsGrid from "./EcommerceProductsGrid";

interface RelatedProductsSectionProps {
  products: EcommerceProduct[];
}

export default function RelatedProductsSection({
  products,
}: RelatedProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: "background.paper", py: 4, mt: 4 }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h5" 
          fontWeight={700}
          gutterBottom
          sx={{ 
            mb: 3,
            textAlign: { xs: "center", md: "left" },
            color: "text.primary"
          }}
        >
          You May Also Like
        </Typography>
        <EcommerceProductsGrid products={products} />
      </Container>
    </Box>
  );
}

