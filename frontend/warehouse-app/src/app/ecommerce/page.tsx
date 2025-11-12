"use client";

import React, { useEffect, useCallback, useMemo } from "react";
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
    country: 'United States of America',
    city: 'New York',
    pincode: '10001',
  });

  const { products, categories, searchQuery, selectedCategory, loading, error } = useProducts();
  const { fetchCart } = useCartActions();
  const { fetchCategories, fetchProducts, setLoading, setError } = useProductActions();

  const hasInitialized = React.useRef(false);
  const country = locationData.location.country;

  const initializeEcommerceData = useCallback(async (country?: string) => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    setLoading(true);

    await Promise.all([
      fetchCategories().catch((err) => console.error("Categories fetch failed:", err)),
      fetchProducts(country).catch((err) => console.error("Products fetch failed:", err)),
      fetchCart().catch((err) => console.error("Cart fetch failed:", err)),
    ]);

    setLoading(false);
  }, [fetchCategories, fetchProducts, fetchCart, setLoading]);
  
  useEffect(() => {
    if (country === undefined) {
      return;
    }
    initializeEcommerceData(country);
  }, [country, initializeEcommerceData]);

  const fetchProductsCallback = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      await fetchProducts(country, searchTerm || undefined);
    } catch (error) {
      console.error("Search fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, fetchProducts, country]);

  const debouncedFetchProducts = useMemo(() =>
    debounce(fetchProductsCallback, 500),
    [fetchProductsCallback]
  );

  useEffect(() => {
    debouncedFetchProducts(searchQuery);
  }, [searchQuery, debouncedFetchProducts]);

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
    hasInitialized.current = false;
    initializeEcommerceData(locationData.location.country);
  };

  const isNetworkError = error && (error.includes("Network Error") || error.includes("Failed to fetch") || error.includes("ECONNREFUSED") || error.includes("timeout"));
  const isInitialLoading = loading && categories.length === 0;
  
  if (isInitialLoading) {
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
    </EcommercePageLayout>
  );
}