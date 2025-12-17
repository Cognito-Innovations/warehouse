"use client";

import React, { useRef, useCallback, useEffect, useMemo } from "react";
import { Container, Alert } from "@mui/material";

import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import { useAuth } from "@/contexts/AuthContext";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout"; 
import SearchEmptyState from "@/components/ecommerce/SearchEmptyState";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import { debounce } from "@/utils/debounce";
import { ecommerceData } from "@/data/ecommerceData";

import ProductsGridView from "@/components/ecommerce/product/ProductsGridView";
import CategorySection from "@/components/ecommerce/category_temp/CategorySection";

export default function Ecommerce() {

  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: "",
    pincode: "",
  });
  const currency = locationData?.currencyInfo?.code || '';
  const countryCode = locationData?.location?.countryCode || '';

  const { user } = useAuth();
  const userId = user?.id;

  const { categories, getCategories } = useCategoryStore();
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

  const { selectedCategory } = useCategoryStore();

  const hasFetched = React.useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const prevCategoryRef = useRef<string | null>(selectedCategory);
  const prevSearchQueryRef = useRef(searchQuery);
  const lastSearchRequestTime = useRef<number>(0);

  const initializeEcommerceData = useCallback(async (curr?: string, cntCode?: string) => {
    if (!curr) return;
    try {
      await getCategories(cntCode);
      await fetchProducts({
        currency: curr,
        countryCode: cntCode,
        searchTerm: searchQuery,
        category: selectedCategory || undefined,
        userId,
      }, true);
    } catch (err) {
      console.error("Init failed", err);
    }
  }, [getCategories, fetchProducts, searchQuery, selectedCategory, userId]);

  useEffect(() => {
    if (currency && !hasFetched.current) {
      initializeEcommerceData(currency, countryCode);
    }
  }, [currency, countryCode, initializeEcommerceData]);

  const performSearch = useCallback((query: string, category: string | null, curr: string, cntCode: string) => {
    const requestTime = Date.now();
    lastSearchRequestTime.current = requestTime;

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

  const debouncedSearch = useMemo(
    () => debounce(
      (query: string, category: string | null, curr: string, cntCode: string) => {
        performSearchRef.current(query, category, curr, cntCode);
      },
      500
    ),
    [] 
  );

  useEffect(() => {
    if (!currency || !countryCode) return;

    if (searchQuery !== prevSearchQueryRef.current) {  
      if (searchQuery.trim() === "") {
        debouncedSearch.cancel();
        performSearchRef.current("", selectedCategory, currency, countryCode);
      } else {
        debouncedSearch(searchQuery, selectedCategory, currency, countryCode);
      }
      prevSearchQueryRef.current = searchQuery;
    }

    return () => {
      debouncedSearch.cancel();
    }
  }, [searchQuery, selectedCategory, currency, countryCode, debouncedSearch]);

  useEffect(() => {
    if (!currency || !countryCode) return;

    if (prevCategoryRef.current !== selectedCategory) {
      debouncedSearch.cancel();

      performSearch(
        searchQuery,
        selectedCategory || null,
        currency,
        countryCode
      );

      prevCategoryRef.current = selectedCategory;
    }
  }, [selectedCategory, currency, countryCode, searchQuery, debouncedSearch, performSearch]);

  useEffect(() => {
    if (!selectedCategory || !observerRef.current || !hasMore || loadingMore || isLoading) return;
    if (observer.current) observer.current.disconnect(); 
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !isLoading) {
        fetchProducts({ 
          category: selectedCategory, 
          currency: currency, 
          countryCode: countryCode,
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
  }, [hasMore, loadingMore, isLoading, selectedCategory, currency, countryCode, searchQuery, fetchProducts, userId]);
  const handleRefresh = () => {
    setError(null);
    hasFetched.current = false;
    initializeEcommerceData(locationData?.currencyInfo?.code || '', locationData?.location?.countryCode || '');
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

  const isSearchEmpty = !!searchQuery && products.length === 0 && !isLoading;

  return (
    <EcommercePageLayout {...layoutProps} >
      <CategorySection />
      {isSearchEmpty ? (
        <SearchEmptyState />
      ) : (
        <ProductsGridView />
      )}
      {selectedCategory && <div ref={observerRef} style={{ height: 10, background: "transparent" }} />}
      
    </EcommercePageLayout>
  );
}