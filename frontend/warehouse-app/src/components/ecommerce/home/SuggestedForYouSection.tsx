"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

import { useProducts } from "@/store/ecommerceStore";
import EcommerceProductsGrid from "../EcommerceProductsGrid";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceProduct } from "@/types/ecommerce";

interface Props {
  products: EcommerceProduct[];
  onProductClick: (product: EcommerceProduct) => void;
}

export default function SuggestedForYouSection({
  products,
  onProductClick,
}: Props) {
    const { selectedCategory, loading } = useProducts();
    if (loading || selectedCategory || products.length === 0) return null;

  return (
    <>
      <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem" },
              color: "#1a1a1a",
              letterSpacing: "0.01em",
            }}
          >
            {ecommerceData.sections.suggestedForYou}
          </Typography>
        </Box>
        <EcommerceProductsGrid
          products={products}
          onProductClick={onProductClick}
        />
      </Box>
      <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />
    </>
  );
}