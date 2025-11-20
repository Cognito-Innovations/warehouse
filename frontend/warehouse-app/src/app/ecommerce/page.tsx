"use client";

import React, { useRef, useCallback, useEffect, useMemo } from "react";
import { Box, Container, Alert, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useProducts, useCartActions, useProductActions } from "../../store/ecommerceStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommerceProductsGrid from "@/components/ecommerce/EcommerceProductsGrid";
import CategoryProductsByCategory from "@/components/ecommerce/CategoryProductsByCategory";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout"; 
import SearchEmptyState from "@/components/ecommerce/SearchEmptyState";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import GridSkeleton from "@/components/ecommerce/skeleton-loader/GridSkeletonLoader";
import { debounce } from "@/utils/debounce";
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
  const { fetchCart } = useCartActions();
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
      await fetchCategories().catch((err) => console.error("Categories fetch failed:", err));
      await Promise.all([
        fetchProducts(countryName).catch((err) => console.error("Products fetch failed:", err)),
        fetchCart().catch((err) => console.error("Cart fetch failed:", err)),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, fetchProducts, fetchCart, setLoading]);

  useEffect(() => {
    if (countryName && products.length === 0 && categories.length === 0) {
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

  const handleProductClick = (product: EcommerceProduct) => {
    router.push(`${ROUTES.PRODUCT}/${product.id}`);
  };

  // Filter products based on selected category
  const filteredProductsByCategory = selectedCategory ? products.filter((product) => product.category.id === selectedCategory) : products;
  
  // Filter out out-of-stock items for Today's Deal and Suggested for You
  const inStockFilteredProducts = filteredProductsByCategory.filter((product) => product.stock_quantity > 0);
  
  // Get products for Today's Deal (5 products from different categories, in stock only)
  // If a category is selected, show products from that category only
  const todaysDealProducts = selectedCategory ? inStockFilteredProducts.slice(0, 5) : getProductsFromDifferentCategories(inStockFilteredProducts, 5);
  
  // Get products for Suggested for You (5 products from different categories, in stock only)
  // If a category is selected, show products from that category only
  const suggestedProducts = selectedCategory ? inStockFilteredProducts.slice(5, 10) : getProductsFromDifferentCategories(inStockFilteredProducts, 5);
  
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
      { isSearchEmpty ? (
        <SearchEmptyState />
      ) : (
        <>
          {/* Section 1: Today's Deal */}
          {!loading && !selectedCategory && todaysDealProducts.length > 0 && (
            <Box sx={{ bgcolor: "white", px: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              </Box>
              <EcommerceProductsGrid
                products={todaysDealProducts}
                onProductClick={handleProductClick}
              />
            </Box>
          )}

          {!loading && !selectedCategory && todaysDealProducts.length > 0 && ( <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />)}
        
          {/* Section 2: Suggested for You */}
          {!loading && !selectedCategory && suggestedProducts.length > 0 && (
            <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem" },
                    color: "#1a1a1a",
                    letterSpacing: "0.01em",
                  }}
                >
                  {ecommerceData.sections.suggestedForYou}
                </Typography>
              </Box>

              <EcommerceProductsGrid
                products={suggestedProducts}
                onProductClick={handleProductClick}
              />
            </Box>
          )}
        
          {!loading && !selectedCategory && suggestedProducts.length > 0 && ( <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />)}
        
          {/* Section 3: All Products by Category */}
          {loading ? (
            <Box sx={{ py: 2, px: 2, bgcolor: "white" }}>
              <GridSkeleton count={10} />
            </Box>
          ) : selectedCategory ? (
            // Show only selected category products
            <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
              <EcommerceProductsGrid
                products={filteredProductsByCategory}
                onProductClick={handleProductClick}
                loading={loadingNextPage}
              />
            </Box>
          ) : (
            // Show all products grouped by category
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