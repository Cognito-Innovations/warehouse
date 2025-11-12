"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Alert } from "@mui/material";
import { useParams, useRouter } from "next/navigation";

import { useProducts, useCart, useCartActions, useProductActions } from "../../../../store/ecommerceStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import { ecommerceService } from "@/services/ecommerce.service";
import ProductDetailHeader from "@/components/ecommerce/ProductDetailHeader";
import ProductDetailImageSection from "@/components/ecommerce/ProductDetailImageSection";
import ProductDetailInfoSection from "@/components/ecommerce/ProductDetailInfoSection";
import ProductDetailLoadingState from "@/components/ecommerce/ProductDetailLoadingState";
import RelatedProductsSection from "@/components/ecommerce/RelatedProductsSection";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import { ROUTES } from "@/utils/constants";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceProduct } from "@/types/ecommerce";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  const { products } = useProducts();
  const { cart } = useCart();
  const { addToCart, updateCartItem, removeFromCart, fetchCart } = useCartActions();
  const { fetchProducts } = useProductActions();

  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<EcommerceProduct | null>(null);
 
  const locationData = useEffectiveUserLocation({
    country: 'United States of America',
    city: 'New York',
    pincode: '10001',
  });
  const country = locationData.location.country;

  const fetchProductById = useCallback(async (id: string, country?: string) => {
    setLoading(true);
    setErrorState(null);
    try {
      const product = await ecommerceService.getProduct(id, country);
      setCurrentProduct(product);
    } catch (err: any) {
      console.error("Failed to fetch product:", err);
      setErrorState(err.message || ecommerceData.productDetail.productNotFound);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial data only once on mount
  useEffect(() => {
    fetchCart().catch((err) => console.error("Cart fetch failed:", err));
  }, []); // Only run once on mount

  useEffect(() => {
    if (country !== undefined) {
      fetchProducts(country).catch((err) => console.error("Products fetch failed:", err));
    }
  }, [country, fetchProducts]);

  // Handle product loading when params.id changes
  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      if (country === undefined) {
        return;
      }
      const initialProduct = products.find((p: EcommerceProduct) => p.id === params.id);
      if (initialProduct) {
        setCurrentProduct(initialProduct);
        setLoading(false);
      } else {
        fetchProductById(params.id, country);
      }
    } else {
      setErrorState(ecommerceData.productDetail.productNotFound);
      setLoading(false);
    }
  }, [params.id, products, country, fetchProductById]);

  const getPreviewProducts = useCallback((product: EcommerceProduct | null) => {
    if (!product || !product.category) return [];
    const sameCategoryProducts = products.filter(
      (p: EcommerceProduct) => p.category.id === product.category.id && p.id !== product.id
    );
    return [product, ...sameCategoryProducts.slice(0, 2)];
  }, [products]);

  const getRelatedProducts = useCallback((product: EcommerceProduct | null) => {
    if (!product) return [];
    // First try to get products from same sub-category
    if (product.sub_category) {
      const sameSubCategoryProducts = products.filter(
        (p: EcommerceProduct) => 
          p.sub_category?.id === product.sub_category.id && 
          p.id !== product.id
      );
      if (sameSubCategoryProducts.length > 0) {
        return sameSubCategoryProducts.slice(0, 5);
      }
    }
    // Fallback to same category products
    if (product.category) {
      const sameCategoryProducts = products.filter(
        (p: EcommerceProduct) => 
          p.category.id === product.category.id && 
          p.id !== product.id
      );
      return sameCategoryProducts.slice(0, 5);
    }
    return [];
  }, [products]);

  const previewProducts = getPreviewProducts(currentProduct);

  const handleProductSelect = (selectedProduct: EcommerceProduct) => {
    setCurrentProduct(selectedProduct);
  };

  const getCartItemQuantity = useCallback((productId: string) => {
    const cartItem = cart?.items.find((item) => item.product.id === productId);
    return cartItem?.quantity || 0;
  }, [cart]);

  const handleProductClick = useCallback((product: EcommerceProduct) => {
    router.push(`${ROUTES.PRODUCT}/${product.id}`);
  }, [router]);

  const handleAddToCartClick = useCallback((e: React.MouseEvent, product: EcommerceProduct) => {
    e.stopPropagation();
    const stockQuantity = product.stock_quantity;
    const currentCartQuantity = getCartItemQuantity(product.id);
    if (currentCartQuantity + 1 <= stockQuantity) {
      addToCart(product.id, 1);
    }
  }, [getCartItemQuantity, addToCart]);

  const handleDecreaseQuantityClick = useCallback((e: React.MouseEvent, product: EcommerceProduct) => {
    e.stopPropagation();
    const cartItem = cart?.items.find((item) => item.product.id === product.id);
    if (cartItem && cartItem.quantity > 1) {
      updateCartItem(cartItem.id, cartItem.quantity - 1);
    }
  }, [cart, updateCartItem]);

  const handleRefresh = () => {
    setLoading(true);
    setErrorState(null);
    if (params.id && typeof params.id === "string" && country !== undefined) {
      fetchProductById(params.id, country);
    }
  };

  const isNetworkError =
    errorState &&
    (errorState.includes("Network Error") ||
      errorState.includes("Failed to fetch") ||
      errorState.includes("ECONNREFUSED") ||
      errorState.includes("timeout"));

  if (loading) {
    return <ProductDetailLoadingState />;
  }

  if (errorState && isNetworkError) {
    return (
      <EcommerceSkeletonLoader
        networkError={ecommerceData.messages.networkError}
        refreshButtonLabel={ecommerceData.messages.refreshButton}
        onRefresh={handleRefresh}
      />
    );
  }

  if (errorState || !currentProduct) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{errorState || ecommerceData.productDetail.productNotFound}</Alert>
      </Container>
    );
  }

 const relatedProducts = getRelatedProducts(currentProduct);

  return (
    <Box sx={{ bgcolor: ecommerceData.ui.colors.productDetailBackground, minHeight: "100vh" }}>
      <ProductDetailHeader />

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
          <ProductDetailImageSection
            product={currentProduct}
            previewProducts={previewProducts}
            onProductSelect={handleProductSelect}
          />

          <ProductDetailInfoSection
            product={currentProduct}
            cart={cart}
            addToCart={addToCart}
            updateCartItem={updateCartItem}
            removeFromCart={removeFromCart}
          />
        </Box>
      </Container>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <RelatedProductsSection
          products={relatedProducts}
          currentProductId={currentProduct.id}
          cart={cart}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCartClick}
          onDecreaseQuantity={handleDecreaseQuantityClick}
          getCartItemQuantity={getCartItemQuantity}
          defaultRating={ecommerceData.ratings.defaultRating}
          defaultReviewCount={ecommerceData.ratings.defaultReviewCount}
          outOfStockLabel={ecommerceData.buttons.outOfStock}
          addButtonLabel={ecommerceData.buttons.add}
          title={ecommerceData.sections.youMayAlsoLike}
        />
      )}
    </Box>
  );
}
