"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";

import { useGridSkeletonCount } from "@/hooks/useGridSkeletonCount";
import EcommerceProductsGrid from "./EcommerceProductsGrid";
import GridSkeletonLoader from "./skeleton-loader/GridSkeletonLoader";
import { EcommerceProduct } from "@/types/ecommerce";

interface RelatedProductsSectionProps {
  products: EcommerceProduct[];
  arePreviewsLoading?: boolean;
}

export default function RelatedProductsSection({
  products,
  arePreviewsLoading = false
}: RelatedProductsSectionProps) {
  const skeletonCount = useGridSkeletonCount({ singleRow: true });

  if (products.length === 0 && !arePreviewsLoading) {
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
          <GridSkeletonLoader count={skeletonCount} />
        ) : (
          <EcommerceProductsGrid products={products} />
        )}
      </Container>
    </Box>
  );
}

