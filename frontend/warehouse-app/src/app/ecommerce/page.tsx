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
import CategorySection from "@/components/ecommerce/category/CategorySection";
import ProductsGridView from "@/components/ecommerce/product/ProductsGridView";

export default function Ecommerce() {

  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: "",
    pincode: "",
  });
  const countryName = locationData.location.countryName;

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
  const prevSearchQueryRef = useRef(searchQuery);
  const prevCountryNameRef = useRef(countryName);
  const prevCategoryRef = useRef(selectedCategory);

  const initializeEcommerceData = useCallback(async (cName?: string) => {
    if (hasFetched.current || !cName) return;
    hasFetched.current = true;
    try {
      await getCategories();
      await fetchProducts({
        country: cName,
        searchTerm: searchQuery,
        category: selectedCategory || undefined,
        userId,
      }, true);
    } catch (err) {
      console.error("Init failed", err);
    }
  }, [getCategories, fetchProducts, searchQuery, selectedCategory, userId]);

  useEffect(() => {
    if (countryName && !hasFetched.current) {
      initializeEcommerceData(countryName);
    }
  }, [countryName, initializeEcommerceData]);

  const performSearch = useCallback((query: string, category: string | null, country: string) => {
    fetchProducts({ 
        searchTerm: query, 
        category: category || undefined, 
        country: country,
        userId 
    }, true);
  }, [fetchProducts, userId]);

  const debouncedSearch = useMemo(() => debounce(performSearch, 500), [performSearch]);

  useEffect(() => {
    if (!countryName) return;

    const searchChanged = searchQuery !== prevSearchQueryRef.current;
    const categoryChanged = selectedCategory !== prevCategoryRef.current;
    const countryChanged = countryName !== prevCountryNameRef.current;

    if (searchChanged || categoryChanged || countryChanged) {
      if (searchChanged && !categoryChanged && !countryChanged) {
        debouncedSearch(searchQuery, selectedCategory, countryName);
      } else {
        performSearch(searchQuery, selectedCategory, countryName);
      }
    }

    prevSearchQueryRef.current = searchQuery;
    prevCategoryRef.current = selectedCategory;
    prevCountryNameRef.current = countryName;
  }, [searchQuery, selectedCategory, countryName, debouncedSearch, performSearch]);

  useEffect(() => {
    if (!selectedCategory || !observerRef.current || !hasMore || loadingMore || isLoading) return;
    if (observer.current) observer.current.disconnect(); 
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !isLoading) {
        fetchProducts({ 
            category: selectedCategory, 
            country: countryName, 
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
  }, [hasMore, loadingMore, isLoading, selectedCategory, countryName, searchQuery, fetchProducts, userId]);
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

  const isSearchEmpty = !!searchQuery && products.length === 0 && !isLoading;

  return (
    <EcommercePageLayout {...layoutProps} >
      <CategorySection />
      {isSearchEmpty ? (
        <SearchEmptyState />
      ) : (
        <ProductsGridView />
      )}
      {selectedCategory && <div ref={observerRef} style={{ height: 10, background: 'transparent' }} />}
      
    </EcommercePageLayout>
  );
}