"use client";

import React, { useRef, useCallback, useEffect, useMemo } from "react";
import { Box, Container, Alert } from "@mui/material";


import { useProducts, useProductActions } from "../../store/ecommerceStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout"; 
import SearchEmptyState from "@/components/ecommerce/SearchEmptyState";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import GridSkeleton from "@/components/ecommerce/skeleton-loader/GridSkeletonLoader";
import { debounce } from "@/utils/debounce";
import { ecommerceData } from "@/data/ecommerceData";
import CategorySection from "@/components/ecommerce/category/CategorySection";
import ProductsGridView from "@/components/ecommerce/product/ProductsGridView";

export default function Ecommerce() {

  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });

  const {
    products = [],
    categories,
    searchQuery,
    selectedCategory,
    loading,
    error,
    hasMoreProducts,
    loadingNextPage,
  } = useProducts();
  const { fetchCategories, fetchProducts, fetchMoreProducts, setLoading, setError } = useProductActions();

  const hasFetched = React.useRef(false);
  const countryName = locationData.location.countryName;
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const prevSearchQueryRef = useRef(searchQuery);
  const prevcountryNameRef = useRef(countryName);

  const fetchProductsCallback = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      await fetchProducts(countryName, searchTerm || undefined);
    } catch (error) {
      console.error("Search fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, fetchProducts, countryName]);

  const debouncedFetchProducts = useMemo(() =>
    debounce(fetchProductsCallback, 500),
    [fetchProductsCallback]
  );

  const initializeEcommerceData = useCallback(async (countryName?: string) => {
    if (hasFetched.current || !countryName) return;
    hasFetched.current = true;
    setLoading(true);
    try {
      await fetchCategories().catch(err => console.error("Categories fetch failed:", err)),
      await Promise.all([
        fetchProducts(countryName).catch(err =>
          console.error("Products fetch failed:", err)
        ),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, fetchProducts, setLoading]);

  useEffect(() => {
    if (countryName && !hasFetched.current) {
      initializeEcommerceData(countryName);
    }
  }, [countryName, products.length, categories.length, initializeEcommerceData]);

  useEffect(() => {
    if (!countryName) return;

    const prevSearchQuery = prevSearchQueryRef.current;
    const prevCountryCode = prevcountryNameRef.current;

    const searchChanged = searchQuery !== prevSearchQuery;
    const countryChanged = prevCountryCode !== undefined && countryName !== prevCountryCode;

    if (searchChanged || countryChanged) {
      setLoading(true);
      if (searchQuery) {
        debouncedFetchProducts(searchQuery);
      } else {
        fetchProductsCallback("");
      }
    }

    prevSearchQueryRef.current = searchQuery;
    prevcountryNameRef.current = countryName;
  }, [searchQuery, countryName, debouncedFetchProducts, setLoading, fetchProductsCallback]);

  useEffect(() => {
    if (!observerRef.current || !hasMoreProducts || loadingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreProducts && !loadingNextPage && !loading) {
        fetchMoreProducts(countryName, searchQuery || undefined);
      }
    }, {
      rootMargin: "300px",
    });
    observer.current.observe(observerRef.current);
    return () => {
      observer.current?.disconnect();
    };
  }, [fetchMoreProducts, hasMoreProducts, loadingNextPage, products.length, loading, countryName, searchQuery]);

 
  // Filter products based on selected category
  const filteredProductsByCategory = selectedCategory ? products.filter((product) => product.category.id === selectedCategory) : products;
  
  const isSearchEmpty = !!searchQuery && filteredProductsByCategory.length === 0;
  
  const handleRefresh = () => {
    setError(null);
    hasFetched.current = false;
    initializeEcommerceData(locationData.location.countryName);
  };

  const isNetworkError = error && (error.includes("Network Error") || error.includes("Failed to fetch") || error.includes("ECONNREFUSED") || error.includes("timeout"));
  const layoutProps = {
    locationData: locationData,
    categories: categories,
  };
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
      <CategorySection />
      { isSearchEmpty ? (
       <SearchEmptyState />
      ) : (
       <ProductsGridView />
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