"use client";

import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

import useCategoryStore from "@/store/categoryStore";
import useProductStore from "@/store/productStore";
import { useAuth } from "@/contexts/AuthContext";
import EcommerceProductsGrid from "./EcommerceProductsGrid";

export default function CategoryProductsByCategory() {
  const getProducts = useProductStore(state=>state.getProducts);
  const products = useProductStore(state=>state.products);
  const isLoading = useProductStore(state=>state.isLoading);
  const getCategories = useCategoryStore(state=>state.getCategories);
  const categories = useCategoryStore(state=>state.categories);
  const hasInitiatedLoadRef = useRef(false);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(()=>{
    if (hasInitiatedLoadRef.current) return;
    
    const currentCategories = useCategoryStore.getState().categories;
    const currentProducts = useProductStore.getState().products;
    const currentIsLoading = useProductStore.getState().isLoading;
    
    if (currentCategories.length === 0) {
      getCategories();
    }
    if (currentProducts.length === 0 && !currentIsLoading) {
      getProducts({ userId });
    }
    
    hasInitiatedLoadRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  // Group products by category
  const productsByCategory = categories.map((category) => ({
    category,
    products: products.filter((product) => product.category.id === category.id),
  })).filter((group) => group.products.length > 0);

  // Show nothing while loading or if no data
  if (isLoading || productsByCategory.length === 0) {
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
          />
        </Box>
      ))}
    </Box>
  );
}

