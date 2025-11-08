"use client";

import React from "react";
import { Box } from "@mui/material";
import { EcommerceProduct, EcommerceProductsGridProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";
import EcommerceProductCard from "./EcommerceProductCard";

export default function EcommerceProductsGrid({
  products,
  onProductClick,
  onAddToCart,
  onDecreaseQuantity,
  getCartItemQuantity,
  getLoadingStates,
  defaultRating,
  defaultReviewCount,
  outOfStockLabel,
  addButtonLabel,
}: EcommerceProductsGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(${ecommerceData.ui.grid.columns.xs}, 1fr)`,
          sm: `repeat(${ecommerceData.ui.grid.columns.sm}, 1fr)`,
          md: `repeat(${ecommerceData.ui.grid.columns.md}, 1fr)`,
          lg: `repeat(${ecommerceData.ui.grid.columns.lg}, 1fr)`,
        },
        gap: 2,
      }}
    >
      {products.map((product: EcommerceProduct) => {
        const cartQuantity = getCartItemQuantity(product.id);
        const loadingStates = getLoadingStates ? getLoadingStates(product.id) : {
          isAddLoading: false,
          isIncrementLoading: false,
          isDecrementLoading: false,
        };

        return (
          <EcommerceProductCard
            key={product.id}
            product={product}
            cartQuantity={cartQuantity}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            onDecreaseQuantity={onDecreaseQuantity}
            defaultRating={defaultRating}
            defaultReviewCount={defaultReviewCount}
            outOfStockLabel={outOfStockLabel}
            addButtonLabel={addButtonLabel}
            isAddLoading={loadingStates.isAddLoading}
            isIncrementLoading={loadingStates.isIncrementLoading}
            isDecrementLoading={loadingStates.isDecrementLoading}
          />
        );
      })}
    </Box>
  );
}

