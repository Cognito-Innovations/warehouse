"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { EcommerceCategory, EcommerceProduct } from "@/types/ecommerce";
import EcommerceProductsGrid from "./EcommerceProductsGrid";
import { EcommerceProductsGridProps } from "@/types/ecommerce";

interface CategoryProductsByCategoryProps extends Omit<EcommerceProductsGridProps, "products"> {
  categories: EcommerceCategory[];
  products: EcommerceProduct[];
}

export default function CategoryProductsByCategory({
  categories,
  products,
  onProductClick,
}: CategoryProductsByCategoryProps) {
  // Group products by category
  const productsByCategory = categories.map((category) => ({
    category,
    products: products.filter((product) => product.category.id === category.id),
  })).filter((group) => group.products.length > 0);

  if (productsByCategory.length === 0) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
      {productsByCategory.map(({ category, products: categoryProducts }) => (
        <Box key={category.id} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            {category.name}
          </Typography>
          <EcommerceProductsGrid
            products={categoryProducts}
            onProductClick={onProductClick}
          />
        </Box>
      ))}
    </Box>
  );
}

