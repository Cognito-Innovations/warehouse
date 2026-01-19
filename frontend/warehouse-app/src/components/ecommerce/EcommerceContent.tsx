"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { Container, Alert, useTheme, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

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
import ProductCardSkeletonLoader from "./skeleton-loader/ProductCardSkeletonLoader";

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

  const categoryRef = useRef<HTMLDivElement | null>(null);
  const skeletonRef = useRef<HTMLDivElement | null>(null);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState(searchQuery);
  const [skeletonCount, setSkeletonCount] = useState(5);
  const [rowHeight, setRowHeight] = useState(300);

  const showAssisted = selectedCategory === "assisted";

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

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

  useEffect(() => {
    const measureRowHeight = () => {
      if (skeletonRef.current) {
        const cardHeight = skeletonRef.current.getBoundingClientRect().height;
        const gap = parseFloat(theme.spacing(isSm ? 2 : 1));
        setRowHeight(cardHeight + gap);
      }
    };

    const timer = setTimeout(measureRowHeight, 0);
    return () => clearTimeout(timer);
  }, [isSm, isMd, isLg, theme]);

  useEffect(() => {
    const calculateSkeletonCount = () => {
      let columns;
      if (isLg) columns = ecommerceData.ui.grid.columns.lg;
      else if (isMd) columns = ecommerceData.ui.grid.columns.md;
      else if (isSm) columns = ecommerceData.ui.grid.columns.sm;
      else columns = ecommerceData.ui.grid.columns.xs;

      let categoryBottom = 100;
      if (categoryRef.current) {
        categoryBottom = categoryRef.current.getBoundingClientRect().bottom;
      }
      const padding = 32;
      const availableHeight = window.innerHeight - categoryBottom - padding;

      const rows = Math.ceil(availableHeight / rowHeight) + 1;

      const count = columns * rows;
      setSkeletonCount(Math.max(count, 4));
    };

    calculateSkeletonCount();

    const handleResize = debounce(calculateSkeletonCount, 200);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel?.();
    };
  }, [isSm, isMd, isLg, rowHeight]);

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
      <Box sx={{ display: 'none' }}>
        <ProductCardSkeletonLoader ref={skeletonRef} />
      </Box>

      <div ref={categoryRef}>
        <CategorySection />
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

      {!showAssisted && <div ref={observerRef} style={{ height: 10 }} />}
    </EcommercePageLayout>
  );
}
