"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Container, Alert } from "@mui/material";

import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import { useAuth } from "@/contexts/AuthContext";
import { useDetectUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout";
import SearchEmptyState from "@/components/ecommerce/SearchEmptyState";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import ProductsGridView from "@/components/ecommerce/product/ProductsGridView";
import CategorySection from "@/components/ecommerce/category_temp/CategorySection";
import AssistedShoppingLandingContent from "@/components/AssistedShopping/getting-started/AssistedShoppingLandingContent";
import GridSkeletonLoader from "./skeleton-loader/GridSkeletonLoader";
import { debounce } from "@/utils/debounce";
import { ecommerceData } from "@/data/ecommerceData";

interface EcommerceContentProps {
  slug?: string;
}

export default function EcommerceContent({ slug }: EcommerceContentProps) {
  const { currencyCode, countryCode, isLoaded } = useDetectUserLocation();
  const { user } = useAuth();
  const userId = user?.id;

  const { categories, getCategories, selectedCategory, setCategory } =
    useCategoryStore();

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

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCategoryRef = useRef<string | null>(null);
  const debouncedSearchRef = useRef<
    (((value: string) => void) & { cancel?: () => void }) | null
  >(null);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState(searchQuery);

  const showAssisted = selectedCategory === "assisted";

  const syncCategoryWithSlug = useCallback(() => {
    const nextCategory = slug ?? null;
    if (nextCategory !== selectedCategory) {
      setCategory(nextCategory);
    }
  }, [slug, selectedCategory, setCategory]);

  const fetchCategoryList = useCallback(() => {
    if (!countryCode) return;
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
          searchTerm: debouncedSearchQuery || undefined,
          currency: currencyCode,
          countryCode,
          userId,
        },
        isCategoryChanged
      );
    } catch (err) {}
  }, [
    isLoaded,
    showAssisted,
    selectedCategory,
    debouncedSearchQuery,
    currencyCode,
    countryCode,
    userId,
    fetchProducts,
  ]);

  const setupIntersectionObserver = useCallback(() => {
    if (
      !observerRef.current ||
      !hasMore ||
      loadingMore ||
      isLoading ||
      showAssisted
    )
      return;

    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        fetchProducts(
          {
            category: selectedCategory || undefined,
            searchTerm: debouncedSearchQuery || undefined,
            currency: currencyCode,
            countryCode,
            userId,
          },
          false
        );
      },
      { rootMargin: "300px" }
    );

    observer.current.observe(observerRef.current);
  }, [
    hasMore,
    loadingMore,
    isLoading,
    showAssisted,
    selectedCategory,
    debouncedSearchQuery,
    currencyCode,
    countryCode,
    userId,
    fetchProducts,
  ]);

  useEffect(() => {
    observer.current?.disconnect();
  }, [selectedCategory, debouncedSearchQuery]);

  useEffect(() => {
    syncCategoryWithSlug();
  }, [syncCategoryWithSlug]);

  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [fetchCategoryProducts]);

  useEffect(() => {
    debouncedSearchRef.current = debounce((value: string) => {
      setDebouncedSearchQuery(value);
    }, 400);

    return () => {
      debouncedSearchRef.current?.cancel?.();
    };
  }, []);

  useEffect(() => {
    debouncedSearchRef.current?.(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setupIntersectionObserver();
    return () => observer.current?.disconnect();
  }, [setupIntersectionObserver]);

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
  const isSearchEmpty = !!debouncedSearchQuery && products.length === 0 && !isLoading;

  return (
    <EcommercePageLayout>
      <CategorySection />

      {showAssisted ? (
        <AssistedShoppingLandingContent />
      ) : showInitialLoader ? (
        <GridSkeletonLoader count={5} />
      ) : isSearchEmpty ? (
        <SearchEmptyState />
      ) : (
        <ProductsGridView />
      )}

      {!showAssisted && <div ref={observerRef} style={{ height: 10 }} />}
    </EcommercePageLayout>
  );
}
