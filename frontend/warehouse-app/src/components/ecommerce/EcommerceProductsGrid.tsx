"use client";

import React from "react";
import { Box } from "@mui/material";
import { EcommerceProduct, EcommerceProductsGridProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";
import EcommerceProductCard from "./EcommerceProductCard";

export default function EcommerceProductsGrid({
  products,
  onProductClick,
}: EcommerceProductsGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: '1fr',
          sm: `repeat(${ecommerceData.ui.grid.columns.sm}, 1fr)`,
          md: `repeat(${ecommerceData.ui.grid.columns.md}, 1fr)`,
          lg: `repeat(${ecommerceData.ui.grid.columns.lg}, 1fr)`,
        },
        gap: 2,
      }}
    >
      {products.map((product: EcommerceProduct) => {
        return (
          <EcommerceProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        );
      })}
    </Box>
  );
}

