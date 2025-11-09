"use client";

import React, { useEffect, useCallback, useState } from "react";
import { Box, Container, Alert, Typography } from "@mui/material";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceProduct } from "@/types/ecommerce";
import { useUserLocation } from "@/hooks/useUserLocation";
import EcommerceHeader from "@/components/ecommerce/EcommerceHeader";
import PromotionalCards from "@/components/ecommerce/PromotionalCards";
import EcommerceProductsGrid from "@/components/ecommerce/EcommerceProductsGrid";
import EcommerceSkeletonLoader from "@/components/ecommerce/EcommerceSkeletonLoader";
import EcommerceCategorySection from "@/components/ecommerce/EcommerceCategorySection";
import EcommerceBottomNavigation from "@/components/ecommerce/EcommerceBottomNavigation";
import CategoryProductsByCategory from "@/components/ecommerce/CategoryProductsByCategory";
import { useProducts, useCart, useCartActions, useProductActions } from "../../store/ecommerceStore";

export default function Ecommerce() {
  const router = useRouter();
  const {
    products,
    categories,
    searchQuery,
    selectedCategory,
    loading,
    error,
  } = useProducts();
  const { itemCount, cart } = useCart();
  const { addToCart, updateCartItem, removeFromCart, fetchCart } = useCartActions();
  const { setSearchQuery, setSelectedCategory, fetchCategories, fetchProducts, setLoading, setError } = useProductActions();

  // Track loading states per product
  const [loadingStates, setLoadingStates] = useState<Record<string, {
    isAddLoading: boolean;
    isIncrementLoading: boolean;
    isDecrementLoading: boolean;
  }>>({});

  // Get user location using geolocation API
  const { location: userLocation } = useUserLocation({
    defaultCity: ecommerceData.location.city,
    defaultPincode: ecommerceData.location.pincode,
    enableGeolocation: true,
  });

  const initializeEcommerceData = useCallback(async () => {
    await Promise.all([
      fetchCategories().catch((err) => console.error("Categories fetch failed:", err)),
      fetchProducts().catch((err) => console.error("Products fetch failed:", err)),
      fetchCart().catch((err) => console.error("Cart fetch failed:", err)),
    ]);
  }, [fetchCategories, fetchProducts, fetchCart]);

  useEffect(() => {
    initializeEcommerceData().finally(() => {
      setLoading(false);
    });
  }, [initializeEcommerceData, setLoading]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleProductClick = (product: EcommerceProduct) => {
    router.push(`${ROUTES.PRODUCT}/${product.id}`);
  };

  const getCartItemQuantity = useCallback((productId: string) => {
    const cartItem = cart?.items.find((item) => item.product.id === productId);
    return cartItem?.quantity || 0;
  }, [cart]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent, product: EcommerceProduct) => {
    e.stopPropagation();
    const cartQuantity = getCartItemQuantity(product.id);
    if (cartQuantity + 1 > product.stock_quantity) {
      return;
    }
    
    const cartItem = cart?.items.find((item) => item.product.id === product.id);
    const isIncrement = cartItem && cartQuantity > 0;
    
    // Set loading state
    setLoadingStates((prev) => ({
      ...prev,
      [product.id]: {
        ...prev[product.id],
        isAddLoading: !isIncrement,
        isIncrementLoading: isIncrement || false,
        isDecrementLoading: false,
      },
    }));

    try {
      if (isIncrement) {
        await updateCartItem(cartItem.id, cartQuantity + 1);
      } else {
        await addToCart(product.id, 1);
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      // Clear loading state
      setLoadingStates((prev) => ({
        ...prev,
        [product.id]: {
          ...prev[product.id],
          isAddLoading: false,
          isIncrementLoading: false,
        },
      }));
    }
  }, [cart, getCartItemQuantity, addToCart, updateCartItem]);

  const handleDecreaseQuantity = useCallback(async (e: React.MouseEvent, product: EcommerceProduct) => {
    e.stopPropagation();
    const cartItem = cart?.items.find((item) => item.product.id === product.id);
    if (!cartItem) return;

    // Set loading state
    setLoadingStates((prev) => ({
      ...prev,
      [product.id]: {
        ...prev[product.id],
        isDecrementLoading: true,
      },
    }));

    try {
      const newQuantity = cartItem.quantity - 1;
      if (newQuantity > 0) {
        await updateCartItem(cartItem.id, newQuantity);
      } else {
        await removeFromCart(cartItem.id);
      }
    } catch (err) {
      console.error("Failed to update cart:", err);
    } finally {
      // Clear loading state
      setLoadingStates((prev) => ({
        ...prev,
        [product.id]: {
          ...prev[product.id],
          isDecrementLoading: false,
        },
      }));
    }
  }, [cart, updateCartItem, removeFromCart]);

  const getLoadingStates = useCallback((productId: string) => {
    return loadingStates[productId] || {
      isAddLoading: false,
      isIncrementLoading: false,
      isDecrementLoading: false,
    };
  }, [loadingStates]);

  // Helper function to get 5 products from different categories
  const getProductsFromDifferentCategories = (productList: EcommerceProduct[], count: number = 5): EcommerceProduct[] => {
    const categoryMap = new Map<string, EcommerceProduct[]>();
    
    // Group products by category
    productList.forEach((product) => {
      const categoryId = product.category.id;
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, []);
      }
      categoryMap.get(categoryId)!.push(product);
    });

    const selectedProducts: EcommerceProduct[] = [];
    const categoryIds = Array.from(categoryMap.keys());
    
    // Pick one product from each category until we have enough
    let categoryIndex = 0;
    while (selectedProducts.length < count && categoryIds.length > 0) {
      const categoryId = categoryIds[categoryIndex % categoryIds.length];
      const categoryProducts = categoryMap.get(categoryId)!;
      
      if (categoryProducts.length > 0) {
        // Pick a product that hasn't been selected yet
        const availableProducts = categoryProducts.filter(
          (p) => !selectedProducts.some((sp) => sp.id === p.id)
        );
        
        if (availableProducts.length > 0) {
          selectedProducts.push(availableProducts[0]);
        } else {
          // If all products from this category are selected, remove it
          categoryIds.splice(categoryIndex % categoryIds.length, 1);
          if (categoryIds.length === 0) break;
        }
      }
      
      categoryIndex++;
      
      // Safety check to prevent infinite loop
      if (categoryIndex > 100) break;
    }

    return selectedProducts.slice(0, count);
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

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    initializeEcommerceData().finally(() => {
      setLoading(false);
    });
  };

  const isNetworkError = error && (error.includes("Network Error") || error.includes("Failed to fetch") || error.includes("ECONNREFUSED") || error.includes("timeout"));

  if (loading) {
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

  if (error && isNetworkError) {
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

  return (
    <Box sx={{ bgcolor: ecommerceData.ui.colors.background, minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: "100%", xl: ecommerceData.ui.spacing.containerMaxWidth, }, mx: "auto" }}>
        <EcommerceHeader
          brandName={ecommerceData.brand.name}
          locationLabel={ecommerceData.location.label}
          city={userLocation.city}
          pincode={userLocation.pincode}
          searchQuery={searchQuery}
          searchPlaceholder={ecommerceData.search.placeholder}
          onSearchChange={setSearchQuery}
          cartItemCount={itemCount}
          onCartClick={() => router.push(ROUTES.CART)}
        />
        
        {/* Today's Deals Section with Promotional Cards */}
        <Box 
          sx={{ 
            bgcolor: "white",
            pt: { xs: 2.5, sm: 3, md: 3.5 },
            pb: { xs: 2, sm: 2.5, md: 3 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
         
          <PromotionalCards
            categories={categories}
            onCategoryFilter={handleCategoryChange}
            selectedCategory={selectedCategory}
          />
        </Box>

        {/* TODO: Add Category Selection - At the top for different UI */}
        {/* Category Selection - At the top */}
        {/* <EcommerceCategorySection
          title=""
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          cartItemCount={itemCount}
          onCartClick={() => router.push(ROUTES.CART)}
          forYouLabel="All"
        /> */}

        {/* Section 1: Today's Deal */}
        {todaysDealProducts.length > 0 && (
          <Box sx={{ bgcolor: "white", px: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            
            </Box>
            <EcommerceProductsGrid
              products={todaysDealProducts}
              cart={cart}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onDecreaseQuantity={handleDecreaseQuantity}
              getCartItemQuantity={getCartItemQuantity}
              getLoadingStates={getLoadingStates}
              defaultRating={ecommerceData.ratings.defaultRating}
              defaultReviewCount={ecommerceData.ratings.defaultReviewCount}
              outOfStockLabel={ecommerceData.buttons.outOfStock}
              addButtonLabel={ecommerceData.buttons.add}
            />
          </Box>
        )}
        {todaysDealProducts.length > 0 && ( <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />)}

        {/* Section 2: Suggested for You */}
        {suggestedProducts.length > 0 && (
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
              cart={cart}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onDecreaseQuantity={handleDecreaseQuantity}
              getCartItemQuantity={getCartItemQuantity}
              getLoadingStates={getLoadingStates}
              defaultRating={ecommerceData.ratings.defaultRating}
              defaultReviewCount={ecommerceData.ratings.defaultReviewCount}
              outOfStockLabel={ecommerceData.buttons.outOfStock}
              addButtonLabel={ecommerceData.buttons.add}
            />
          </Box>
        )}
        {suggestedProducts.length > 0 && ( <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />)}

        {/* Section 3: All Products by Category */}
        {selectedCategory ? (
          // Show only selected category products
          <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
            <EcommerceProductsGrid
              products={filteredProductsByCategory}
              cart={cart}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onDecreaseQuantity={handleDecreaseQuantity}
              getCartItemQuantity={getCartItemQuantity}
              getLoadingStates={getLoadingStates}
              defaultRating={ecommerceData.ratings.defaultRating}
              defaultReviewCount={ecommerceData.ratings.defaultReviewCount}
              outOfStockLabel={ecommerceData.buttons.outOfStock}
              addButtonLabel={ecommerceData.buttons.add}
            />
          </Box>
        ) : (
          // Show all products grouped by category
          <CategoryProductsByCategory
            categories={categories}
            products={products}
            cart={cart}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onDecreaseQuantity={handleDecreaseQuantity}
            getCartItemQuantity={getCartItemQuantity}
            getLoadingStates={getLoadingStates}
            defaultRating={ecommerceData.ratings.defaultRating}
            defaultReviewCount={ecommerceData.ratings.defaultReviewCount}
            outOfStockLabel={ecommerceData.buttons.outOfStock}
            addButtonLabel={ecommerceData.buttons.add}
          />
        )}

        <EcommerceBottomNavigation
          cartItemCount={itemCount}
          cartLabel={ecommerceData.navigation.cart}
          ordersLabel={ecommerceData.navigation.orders}
          accountLabel={ecommerceData.navigation.account}
          onCartClick={() => router.push(ROUTES.CART)}
        />
      </Container>
    </Box>
  );
}
