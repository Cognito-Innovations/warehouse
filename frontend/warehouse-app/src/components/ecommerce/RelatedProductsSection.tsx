"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { EcommerceProduct } from "@/types/ecommerce";
import EcommerceProductsGrid from "./EcommerceProductsGrid";
import GridSkeletonLoader from "./skeleton-loader/GridSkeletonLoader";

interface RelatedProductsSectionProps {
  products: EcommerceProduct[];
  arePreviewsLoading?: boolean;
}

export default function RelatedProductsSection({
  products,
  arePreviewsLoading = false
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
        {arePreviewsLoading ? (
          <GridSkeletonLoader count={5} />
        ) : (
          <EcommerceProductsGrid products={products} />
        )}
      </Container>
    </Box>
  );
}

