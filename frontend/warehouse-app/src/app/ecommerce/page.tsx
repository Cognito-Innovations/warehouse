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
import CategorySkeleton from "@/components/ecommerce/skeleton-loader/CategorySkeletonLoader";
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
  const { fetchCategories, fetchProducts, fetchMoreProducts, setLoading, setError, resetProducts } = useProductActions();

  const hasFetched = React.useRef(false);
  const countryCode = locationData.location.countryCode;
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchProductsCallback = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      await fetchProducts(countryCode, searchTerm || undefined);
    } catch (error) {
      console.error("Search fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, fetchProducts, countryCode]);

  const debouncedFetchProducts = useMemo(() =>
    debounce(fetchProductsCallback, 500),
    [fetchProductsCallback]
  );

  const initializeEcommerceData = useCallback(async (countryCode?: string) => {
    if (hasFetched.current || !countryCode) return;
    hasFetched.current = true;
    setLoading(true);
    await Promise.all([
      fetchCategories().catch((err) => console.error("Categories fetch failed:", err)),
      fetchProducts(countryCode).catch((err) => console.error("Products fetch failed:", err)),
      fetchCart().catch((err) => console.error("Cart fetch failed:", err)),
    ]);
    setLoading(false);
  }, [fetchCategories, fetchProducts, fetchCart, setLoading]);

  useEffect(() => {
    if (countryCode && (products.length === 0 || categories.length === 0) && !loading) {
      initializeEcommerceData(countryCode);
    }
  }, [countryCode, products.length, categories.length, initializeEcommerceData, loading]);

  useEffect(() => {
    if ((searchQuery || selectedCategory) && countryCode) {
      resetProducts();
      debouncedFetchProducts(searchQuery);
    }
  }, [searchQuery, selectedCategory, countryCode, debouncedFetchProducts, resetProducts]);

  useEffect(() => {
    if (!observerRef.current || !hasMoreProducts || loadingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreProducts && !loadingNextPage && !loading) {
        fetchMoreProducts(countryCode, searchQuery || undefined);
      }
    }, {
      rootMargin: "300px",
    });
    observer.current.observe(observerRef.current);
    return () => {
      observer.current?.disconnect();
    };
  }, [fetchMoreProducts, hasMoreProducts, loadingNextPage, products.length, loading, countryCode, searchQuery]);

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
    initializeEcommerceData(locationData.location.countryCode);
  };

  const isNetworkError = error && (error.includes("Network Error") || error.includes("Failed to fetch") || error.includes("ECONNREFUSED") || error.includes("timeout"));
  const dataReady = products.length > 0 && categories.length > 0;
  if (!dataReady) {
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

  if (error && isNetworkError && categories.length === 0) {
    return (
      <EcommerceSkeletonLoader
        networkError={ecommerceData.messages.networkError}
        refreshButtonLabel={ecommerceData.messages.refreshButton}
        onRefresh={handleRefresh}
      />
    );
  }

  if (error && !isNetworkError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const layoutProps = {
    locationData: locationData,
    categories: categories,
  };

  if (loading && categories.length > 0) {
    return (
      <EcommercePageLayout {...layoutProps}>
        {!selectedCategory && (
          <Box sx={{ bgcolor: "white", px: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }} />
            <GridSkeleton count={5} />
          </Box>
        )}

        {!selectedCategory && <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />}
        
        {!selectedCategory && (
          <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
            <GridSkeleton count={5} hasTitle={true} titleWidth={180} />
          </Box>
        )}

        {!selectedCategory && <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />}
        
        {selectedCategory ? (
          <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
            <GridSkeleton count={10} />
          </Box>
        ) : (
          <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
            <CategorySkeleton numCategories={2} />
          </Box>
        )}
      </EcommercePageLayout>
    );
  }

  return (
    <EcommercePageLayout {...layoutProps}>
      {isSearchEmpty ? (
        <SearchEmptyState />
      ) : (
        <>
          {/* Section 1: Today's Deal */}
          {!selectedCategory && todaysDealProducts.length > 0 && (
            <Box sx={{ bgcolor: "white", px: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              </Box>
              <EcommerceProductsGrid
                products={todaysDealProducts}
                onProductClick={handleProductClick}
              />
            </Box>
          )}

          {!selectedCategory && todaysDealProducts.length > 0 && ( <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />)}
        
          {/* Section 2: Suggested for You */}
          {!selectedCategory && suggestedProducts.length > 0 && (
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
        
          {!selectedCategory && suggestedProducts.length > 0 && ( <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />)}
        
          {/* Section 3: All Products by Category */}
          {selectedCategory ? (
            // Show only selected category products
            <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
              <EcommerceProductsGrid
                products={filteredProductsByCategory}
                onProductClick={handleProductClick}
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