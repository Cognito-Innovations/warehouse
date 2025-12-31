"use client";

import React from "react";
import { Box } from "@mui/material";
import { EcommerceProduct, EcommerceProductsGridProps } from "@/types/ecommerce";
import EcommerceProductCard from "./EcommerceProductCard";
import ProductCardSkeletonLoader from "./skeleton-loader/ProductCardSkeletonLoader";

export default function EcommerceProductsGrid({
  products,
  loading = false,
}: EcommerceProductsGridProps) {
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
        gap: 2,
      }}
    >
      {products.map((product: EcommerceProduct) => {
        return (
          <EcommerceProductCard
            key={product.id}
            product={product}
          />
        );
      })}
      {loading && (
        <>
          {[...Array(4)].map((_, index) => (
            <ProductCardSkeletonLoader key={`skeleton-${index}`} />
          ))}
        </>
      )}
    </Box>
  );
}

