"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { EcommerceProduct } from "@/types/ecommerce";
import EcommerceProductsGrid from "./EcommerceProductsGrid";

interface RelatedProductsSectionProps {
  products: EcommerceProduct[];
  currentProductId: string;
  cart: any;
  onProductClick: (product: EcommerceProduct) => void;
  onAddToCart: (e: React.MouseEvent, product: EcommerceProduct) => void;
  onDecreaseQuantity: (e: React.MouseEvent, product: EcommerceProduct) => void;
  getCartItemQuantity: (productId: string) => number;
  defaultRating: number;
  defaultReviewCount: number;
  outOfStockLabel: string;
  addButtonLabel: string;
  title: string;
}

export default function RelatedProductsSection({
  products,
  currentProductId,
  cart,
  onProductClick,
  onAddToCart,
  onDecreaseQuantity,
  getCartItemQuantity,
  defaultRating,
  defaultReviewCount,
  outOfStockLabel,
  addButtonLabel,
  title,
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
          {title}
        </Typography>
        <EcommerceProductsGrid
          products={products}
          cart={cart}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onDecreaseQuantity={onDecreaseQuantity}
          getCartItemQuantity={getCartItemQuantity}
          defaultRating={defaultRating}
          defaultReviewCount={defaultReviewCount}
          outOfStockLabel={outOfStockLabel}
          addButtonLabel={addButtonLabel}
        />
      </Container>
    </Box>
  );
}

