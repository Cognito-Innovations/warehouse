"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Container, Alert } from "@mui/material";

import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import { useAuth } from "@/contexts/AuthContext";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout";
import SearchEmptyState from "@/components/ecommerce/SearchEmptyState";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import ProductsGridView from "@/components/ecommerce/product/ProductsGridView";
import CategorySection from "@/components/ecommerce/category_temp/CategorySection";
import AssistedShoppingLandingContent from "@/components/AssistedShopping/getting-started/AssistedShoppingLandingContent";
import { ecommerceData } from "@/data/ecommerceData";
import { debounce } from "@/utils/debounce";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  
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

  useEffect(() => {
    if (slug && slug !== selectedCategory) {
      setCategory(slug);
    }
  }, [slug, selectedCategory, setCategory]);

  const initializeEcommerceData = useCallback(async (curr?: string, cntCode?: string) => {
    if (!curr || hasFetched.current || !slug) return;
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
        category: slug,
        userId,
      }, true);
    } catch (err) {
      console.error("Init failed", err);
    }
  }, [getCategories, fetchProducts, selectedCategory, userId, slug]);

  useEffect(() => {
    if (currency && countryCode) {
      initializeEcommerceData(currency, countryCode);
    }
  }, [currency, countryCode, initializeEcommerceData]);

  const performSearch = useCallback((query: string, category: string | null, curr: string, cntCode: string) => {
    if (category === "assisted") return;
    fetchProducts({
      searchTerm: query,
      category: category || slug || undefined,
      currency: curr,
      countryCode: cntCode,
      userId
    }, true);
  }, [fetchProducts, userId, slug]);

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
    if (!currency || !countryCode) return;
    if (searchQuery === prevSearchQueryRef.current) return;
    if (searchQuery.trim() === "") {
      debouncedSearchRef.current?.cancel?.();
      performSearchRef.current("", selectedCategory, currency, countryCode);
    } else {
      debouncedSearchRef.current?.(searchQuery, selectedCategory, currency, countryCode);
    }
    prevSearchQueryRef.current = searchQuery;
  }, [searchQuery, selectedCategory, currency, countryCode]);

  useEffect(() => {
    if (!currency || !countryCode) return;
    if (prevCategoryRef.current !== selectedCategory) {
      debouncedSearchRef.current?.cancel?.();
      performSearch(
        searchQuery,
        selectedCategory || null,
        currency,
        countryCode
      );
      prevCategoryRef.current = selectedCategory;
    }
  }, [selectedCategory, currency, countryCode, searchQuery, performSearch]);

  useEffect(() => {
    if (!selectedCategory || !observerRef.current || !hasMore || loadingMore || isLoading) return;
    observer.current?.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !isLoading) {
        fetchProducts({
          category: selectedCategory,
          currency,
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
  }, [hasMore, loadingMore, isLoading, selectedCategory, currency, countryCode, searchQuery, fetchProducts, userId]);
  
  const handleRefresh = () => {
    setError(null);
    hasFetched.current = false;
    initializeEcommerceData(currency, countryCode);
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