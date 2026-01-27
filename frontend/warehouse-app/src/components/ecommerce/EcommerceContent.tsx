"use client";

import React, { useEffect, useRef } from "react";
import { Container, Alert, Box } from "@mui/material";


import useProductStore from "@/store/productStore";
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
export default function EcommerceContent({ slug }: EcommerceContentProps) {
  const { isLoaded, fetchLocationBasedOnUser } = useDetectUserLocation();
  const { user } = useAuth();
  const {
    products,
    isLoading,
    error,
    setError,
  } = useProductStore();

  const skeletonRef = useRef<HTMLDivElement | null>(null);
  const showAssisted = false; //selectedCategory === "assisted";

  const skeletonCount = useGridSkeletonCount({
    itemHeight: 10,
    offsetY: 1 + 32,
    minCount: 4
  });

  useEffect(() => {
    fetchLocationBasedOnUser((user as any)?.id);
  }, [user, fetchLocationBasedOnUser]);


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

  if (!isLoaded && !error) {
    return <EcommerceSkeletonLoader />;
  }

  if (
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
  
      <Category slug={slug} />

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
