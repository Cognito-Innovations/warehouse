"use client";

import React from "react";
import { Box } from "@mui/material";

import { useProducts } from "@/store/ecommerceStore";
import EcommerceProductsGrid from "../EcommerceProductsGrid";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceProduct } from "@/types/ecommerce";

interface Props {
  products: EcommerceProduct[];
  onProductClick: (product: EcommerceProduct) => void;
}

export default function TodaysDealSection({
  products,
  onProductClick,
}: Props) {
  const { selectedCategory, loading } = useProducts();
  if (loading || selectedCategory || products.length === 0) return null;

  return (
    <>
      <Box sx={{ bgcolor: "white", px: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }} />
        <EcommerceProductsGrid
          products={products}
          onProductClick={onProductClick}
        />
      </Box>
      <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />
    </>
  );
}