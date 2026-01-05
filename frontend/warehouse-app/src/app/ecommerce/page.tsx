"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { Container, Alert } from "@mui/material";

import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import { useAuth } from "@/contexts/AuthContext";
import { useDetectUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout";
import SearchEmptyState from "@/components/ecommerce/SearchEmptyState";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import { debounce } from "@/utils/debounce";
import { ecommerceData } from "@/data/ecommerceData";

import ProductsGridView from "@/components/ecommerce/product/ProductsGridView";
import CategorySection from "@/components/ecommerce/category_temp/CategorySection";
import AssistedShoppingLandingContent from "@/components/AssistedShopping/getting-started/AssistedShoppingLandingContent";

export default function Ecommerce() {
  const {currencyInfo, countryCode} = useDetectUserLocation();
  const currencyCode = currencyInfo.code;

  const { user } = useAuth();
  const userId = user?.id;

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

  const showAssisted = selectedCategory === "assisted";
  const hasFetched = useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const prevSearchQueryRef = useRef(searchQuery);
  const prevCategoryRef = useRef<string | null>(selectedCategory);

  const initializeEcommerceData = useCallback(async (curr?: string, cntCode?: string) => {
    if (!curr || hasFetched.current) return;
    if (selectedCategory === "assisted") {
      hasFetched.current = true;
      return;
    }
    try {
      hasFetched.current = true;
      await getCategories(cntCode);
      await fetchProducts({
        currency: curr,
        countryCode: cntCode,
        category: selectedCategory || undefined,
        userId,
      }, true);
    } catch (err) {
      console.error("Init failed", err);
    }
  }, [getCategories, fetchProducts, selectedCategory, userId]);

  useEffect(() => {
    if (currencyCode && countryCode) {
      initializeEcommerceData(currencyCode, countryCode);
    }
  }, [currencyCode, countryCode, initializeEcommerceData]);

  const performSearch = useCallback((query: string, category: string | null, curr: string, cntCode: string) => {
    if (category === "assisted") return;
    fetchProducts({ 
      searchTerm: query, 
      category: category || undefined, 
      currency: curr,
      countryCode: cntCode,
      userId 
    }, true);
  }, [fetchProducts, userId]);

  const performSearchRef = useRef(performSearch);

  useEffect(() => {
    performSearchRef.current = performSearch;
  }, [performSearch]);

  const debouncedSearchRef = useRef<
    (((...args: any[]) => void) & { cancel?: () => void }) | null
  >(null);

  useEffect(() => {
    debouncedSearchRef.current = debounce(
      (query, category, curr, cntCode) => {
        performSearchRef.current(query, category, curr, cntCode);
      },
      500
    );

    return () => {
      debouncedSearchRef.current?.cancel?.();
    };
  }, []);

  useEffect(() => {
    if (!currencyCode || !countryCode) return;
    if (searchQuery === prevSearchQueryRef.current) return;

    if (searchQuery.trim() === "") {
      debouncedSearchRef.current?.cancel?.();
      performSearchRef.current("", selectedCategory, currencyCode, countryCode);
    } else {
      debouncedSearchRef.current?.(searchQuery, selectedCategory, currencyCode, countryCode);
    }
    prevSearchQueryRef.current = searchQuery;
  }, [searchQuery, selectedCategory, currencyCode, countryCode]);

  useEffect(() => {
    if (!currencyCode || !countryCode) return;

    if (prevCategoryRef.current !== selectedCategory) {
      debouncedSearchRef.current?.cancel?.();

      performSearch(
        searchQuery,
        selectedCategory || null,
        currencyCode,
        countryCode
      );

      prevCategoryRef.current = selectedCategory;
    }
  }, [selectedCategory, currencyCode, countryCode, searchQuery, performSearch]);

  useEffect(() => {
    if (!selectedCategory || !observerRef.current || !hasMore || loadingMore || isLoading) return;
    observer.current?.disconnect(); 
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !isLoading) {
        fetchProducts({ 
          category: selectedCategory, 
          currency: currencyCode,
          countryCode,
          searchTerm: searchQuery,
          userId 
        }, false);
      }
    }, {
      rootMargin: "300px",
    });
    observer.current.observe(observerRef.current);
    return () => {
      observer.current?.disconnect();
    };
  }, [hasMore, loadingMore, isLoading, selectedCategory, currencyCode, countryCode, searchQuery, fetchProducts, userId]);
  const handleRefresh = () => {
    setError(null);
    hasFetched.current = false;
    initializeEcommerceData(currencyCode, countryCode);
  };

  const isNetworkError = error && (error.includes("Network Error") || error.includes("Failed to fetch") || error.includes("ECONNREFUSED") || error.includes("timeout"));
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

  const isSearchEmpty = !!searchQuery && products.length === 0 && !isLoading;

  return (
    <EcommercePageLayout>
      <CategorySection />
      {showAssisted ? (
        <AssistedShoppingLandingContent />
      ) : isSearchEmpty ? (
        <SearchEmptyState />
      ) : (
        <ProductsGridView />
      )}
      {!showAssisted && selectedCategory && <div ref={observerRef} style={{ height: 10 }} />}
      
    </EcommercePageLayout>
  );
}