"use client";

import React, { useRef, useMemo } from "react";
import { Box, Container, Alert } from "@mui/material";
import { useRouter } from "next/navigation";

import { useProducts, useProductActions } from "../../store/ecommerceStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import { useEcommerceInitialization } from "@/hooks/useEcommerceInitialization";
import { useSearchProducts } from "@/hooks/useSearchProducts";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import TodaysDealSection from "@/components/ecommerce/home/TodaysDealSection";
import SuggestedForYouSection from "@/components/ecommerce/home/SuggestedForYouSection";
import EcommerceProductsGrid from "@/components/ecommerce/EcommerceProductsGrid";
import CategoryProductsByCategory from "@/components/ecommerce/CategoryProductsByCategory";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout"; 
import SearchEmptyState from "@/components/ecommerce/SearchEmptyState";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import GridSkeleton from "@/components/ecommerce/skeleton-loader/GridSkeletonLoader";
import { ROUTES } from "@/utils/constants";
import { getProductsFromDifferentCategories } from "@/utils/productUtils";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceProduct } from "@/types/ecommerce";

export default function Ecommerce() {
  const router = useRouter();

  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const countryCode = locationData.location.countryCode;

  const {
    products = [],
    categories,
    searchQuery,
    selectedCategory,
    loading,
    error,
    loadingNextPage,
  } = useProducts();
  const { setError, resetProducts } = useProductActions();

  useEcommerceInitialization(countryCode);
  useSearchProducts(countryCode);

  const observerRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(observerRef, countryCode);

  const handleProductClick = useMemo(
    () => (product: EcommerceProduct) => router.push(`${ROUTES.PRODUCT}/${product.id}`),
    [router]
  );
  
  const filteredProductsByCategory = useMemo(
    () => selectedCategory
      ? products.filter((product) => product.category.id === selectedCategory)
      : products,
    [selectedCategory, products]
  );
  
  const inStockFilteredProducts = useMemo(
    () => filteredProductsByCategory.filter((product) => product.stock_quantity > 0),
    [filteredProductsByCategory]
  );
  
  const todaysDealProducts = useMemo(
    () => selectedCategory
      ? inStockFilteredProducts.slice(0, 5)
      : getProductsFromDifferentCategories(inStockFilteredProducts, 5),
    [selectedCategory, inStockFilteredProducts]
  );
  
  const suggestedProducts = useMemo(
    () => selectedCategory
      ? inStockFilteredProducts.slice(5, 10)
      : getProductsFromDifferentCategories(inStockFilteredProducts, 5),
    [selectedCategory, inStockFilteredProducts]
  );
  
  const isSearchEmpty = !!searchQuery && filteredProductsByCategory.length === 0;
  
  const handleRefresh = () => {
    setError(null);
    resetProducts();
  };

  const isNetworkError = error && (
    error.includes("Network Error") || 
    error.includes("Failed to fetch") || 
    error.includes("ECONNREFUSED") || 
    error.includes("timeout")
  );

  const layoutProps = useMemo(
    () => ({ locationData, categories }),
    [locationData, categories]
  );

  if (error && !isNetworkError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (categories.length === 0 || (error && isNetworkError)) {
    return (
      <EcommerceSkeletonLoader
        {...(error && isNetworkError
          ? {
              networkError: ecommerceData.messages.networkError,
              refreshButtonLabel: ecommerceData.messages.refreshButton,
              onRefresh: handleRefresh,
            }
          : {})}
      />
    );
  }
  return (
    <EcommercePageLayout {...layoutProps}>
      { isSearchEmpty ? (
        <SearchEmptyState />
      ) : (
        <>
          <TodaysDealSection
            products={todaysDealProducts}
            onProductClick={handleProductClick}
          />

          <SuggestedForYouSection
            products={suggestedProducts}
            onProductClick={handleProductClick}
          />

          {loading ? (
            <Box sx={{ py: 2, px: 2, bgcolor: "white" }}>
              <GridSkeleton count={10} />
            </Box>
          ) : selectedCategory ? (
            <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
              <EcommerceProductsGrid
                products={filteredProductsByCategory}
                onProductClick={handleProductClick}
              />
            </Box>
          ) : (
            <CategoryProductsByCategory
              categories={categories}
              products={products}
              onProductClick={handleProductClick}
            />
          )}
        </>
      )}
      {loadingNextPage && (
        <Box sx={{ py: 2 }}>
          <GridSkeleton count={5} />
        </Box>
      )}
      <div ref={observerRef} />
    </EcommercePageLayout>
  );
}