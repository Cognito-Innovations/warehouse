"use client";

import React from "react";
import { Box } from "@mui/material";

import { useGridSkeletonCount } from "@/hooks/useGridSkeletonCount";
import EcommerceProductCard from "./EcommerceProductCard";
import ProductCardSkeletonLoader from "./skeleton-loader/ProductCardSkeletonLoader";
import { EcommerceProduct, EcommerceProductsGridProps } from "@/types/ecommerce";

export default function EcommerceProductsGrid({
  products,
  loading = false,
}: EcommerceProductsGridProps) {
  const skeletonCount = useGridSkeletonCount({
    itemHeight: 320,
    minCount: 4
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(auto-fill, minmax(220px, 1fr))",
          md: "repeat(auto-fill, minmax(240px, 1fr))",
          lg: "repeat(auto-fill, minmax(260px, 1fr))",
        },
        gap: { xs: 1, sm: 2 },
      }}
    >
      {products.map((product: EcommerceProduct) => {
        return (
          <EcommerceProductCard
            key={`${product.id}-product-grid`}
            product={product}
          />
        );
      })}
      
      {loading && (
        <>
          {[...Array(skeletonCount)].map((_, index) => (
            <ProductCardSkeletonLoader key={`skeleton-${index}`} />
          ))}
        </>
      )}
    </Box>
  );
}

