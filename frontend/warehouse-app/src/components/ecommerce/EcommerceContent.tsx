"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { Container, Alert, useTheme, Box } from "@mui/material";


import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import { useAuth } from "@/contexts/AuthContext";
import { useDetectUserLocation } from "@/hooks/useDetectUserLocation";
import { useGridSkeletonCount } from "@/hooks/useGridSkeletonCount";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout";
import SearchEmptyState from "@/components/ecommerce/SearchEmptyState";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import ProductsGridView from "@/components/ecommerce/product/ProductsGridView";
import AssistedShoppingLandingContent from "@/components/AssistedShopping/getting-started/AssistedShoppingLandingContent";
import GridSkeletonLoader from "./skeleton-loader/GridSkeletonLoader";

import { ecommerceData } from "@/data/ecommerceData";
import ProductCardSkeletonLoader from "./skeleton-loader/ProductCardSkeletonLoader";
import Category from "../Category/Category";

interface EcommerceContentProps {
  slug?: string;
}

//TODO P0: catagory should be seperate component
//TODO P0: remove search as of now
//TODO P0: <EcommerceSkeletonLoader with network tab, logic incorrect, needs to fix it correct it properly
export default function EcommerceContent({ slug }: EcommerceContentProps) {
  const { currencyCode, countryCode, isLoaded, fetchLocationBasedOnUser } = useDetectUserLocation();
  const { user } = useAuth();
  const { categories, getCategories, selectedCategory, setCategory } = useCategoryStore();
  const {
    products,
    isLoading,
    loadingMore,
    hasMore,
    error,
    fetchProducts,
    setError,
    searchQuery,
  } = useProductStore();

  const lastCategoryRef = useRef<string | null>(null);
  const skeletonRef = useRef<HTMLDivElement | null>(null);

  const showAssisted = selectedCategory === "assisted";

  const skeletonCount = useGridSkeletonCount({
    itemHeight: 10,
    offsetY: 1 + 32,
    minCount: 4
  });

  const syncCategoryWithSlug = useCallback(() => {
    const nextCategory = slug ?? null;
    if (nextCategory !== selectedCategory) {
      setCategory(nextCategory);
    }
  }, [slug, selectedCategory, setCategory]);

  const fetchCategoryList = useCallback(() => {
    if (!countryCode) return [];
    getCategories(countryCode);
  }, [countryCode, getCategories]);

  const fetchCategoryProducts = useCallback(async () => {
    if (!isLoaded || showAssisted) return;

    const isCategoryChanged = lastCategoryRef.current !== selectedCategory;
    lastCategoryRef.current = selectedCategory;

    try {
      await fetchProducts(
        {
          category: selectedCategory || undefined,
          searchTerm: undefined,
          currency: currencyCode,
          countryCode,
          userId: user.id,
        },
        isCategoryChanged
      );
    } catch (err) {}
  }, [
    isLoaded,
    showAssisted,
    selectedCategory,
    currencyCode,
    countryCode,
    user.id,
    fetchProducts,
  ]);

  useEffect(() => {
    syncCategoryWithSlug();
  }, [syncCategoryWithSlug]);

  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [fetchCategoryProducts]);


  const handleRefresh = () => {
    setError(null);
  };

  const isNetworkError =
    error &&
    (error.includes("Network Error") ||
      error.includes("Failed to fetch") ||
      error.includes("ECONNREFUSED") ||
      error.includes("timeout"));

  if (error && !isNetworkError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  useEffect(() => {
    fetchLocationBasedOnUser((user as any)?.id);
  }, []);

  if (
    // categories.length === 0 || 
    (error && isNetworkError)) {
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

  const showInitialLoader = isLoading && products.length === 0 && !showAssisted;
  const isSearchEmpty = false  // products.length === 0 && !isLoading; fix it 

  return (
    <EcommercePageLayout>
      <Box sx={{ display: 'none' }}>
        <ProductCardSkeletonLoader ref={skeletonRef} />
      </Box>

      <div>
        <Category />
      </div>

      {showAssisted ? (
        <AssistedShoppingLandingContent />
      ) : showInitialLoader ? (
        <GridSkeletonLoader count={skeletonCount} />
      ) : isSearchEmpty ? (
        <SearchEmptyState />
      ) : (
        <ProductsGridView />
      )}

    </EcommercePageLayout>
  );
}
