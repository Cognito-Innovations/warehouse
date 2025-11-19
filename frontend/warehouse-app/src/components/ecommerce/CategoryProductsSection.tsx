"use client";

import React from "react";
import { Box } from "@mui/material";
import { EcommerceCategory, EcommerceProduct } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";
import EcommerceCategorySection from "./EcommerceCategorySection";
import EcommerceProductsGrid from "./EcommerceProductsGrid";
import EcommerceEmptyState from "./EcommerceEmptyState";
import { EcommerceProductsGridProps } from "@/types/ecommerce";

interface CategoryProductsSectionProps extends Omit<EcommerceProductsGridProps, "products"> {
  categories: EcommerceCategory[];
  products: EcommerceProduct[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  cartItemCount: number;
  onCartClick: () => void;
  forYouLabel: string;
}

export default function CategoryProductsSection({
  categories,
  products,
  selectedCategory,
  onCategoryChange,
  cartItemCount,
  onCartClick,
  forYouLabel,
  onProductClick,
  onAddToCart,
  onDecreaseQuantity,
  getCartItemQuantity,
  defaultRating,
  defaultReviewCount,
  outOfStockLabel,
  addButtonLabel,
  cart,
}: CategoryProductsSectionProps) {
  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category.id === selectedCategory)
    : products;

  return (
    <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
      <EcommerceCategorySection
        title={ecommerceData.sections.todaysDeals}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        cartItemCount={cartItemCount}
        onCartClick={onCartClick}
        forYouLabel={forYouLabel}
      />
      <Box sx={{ mt: 2 }}>
        {filteredProducts.length > 0 ? (
          <EcommerceProductsGrid
            products={filteredProducts}
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
        ) : (
          <EcommerceEmptyState
            title={ecommerceData.messages.noProductsFound}
            description={ecommerceData.messages.noProductsDescription}
          />
        )}
      </Box>
    </Box>
  );
}

