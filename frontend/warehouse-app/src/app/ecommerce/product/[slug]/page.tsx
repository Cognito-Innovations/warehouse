"use client";

import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { Box, Container, Alert } from "@mui/material";
import { useParams } from "next/navigation";

import useProductStore from "@/store/productStore";
import { useAuth } from "@/contexts/AuthContext";
import { useDetectUserLocation } from "@/hooks/useEffectiveUserLocation";
import ProductDetailImageSection from "@/components/ecommerce/ProductDetailImageSection";
import ProductDetailInfoSection from "@/components/ecommerce/ProductDetailInfoSection";
import ProductDetailLoadingState from "@/components/ecommerce/ProductDetailLoadingState";
import RelatedProductsSection from "@/components/ecommerce/RelatedProductsSection";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceProduct } from "@/types/ecommerce";

export default function ProductDetailPage() {
  const params = useParams();

  const { 
    products,
    currentDetailProduct,
    detailPreviewProducts,
    detailRelatedProducts,
    isDetailLoading,
    arePreviewsLoading,
    detailError,
    loadProductPageData,
    setCurrentDetailProduct,
  } = useProductStore();
 
  const {currencyCode, countryCode} = useDetectUserLocation();

  const { user } = useAuth();
  const userId = user?.id;

  const productSlug = useMemo(() => {
    return params.slug && typeof params.slug === "string" ? params.slug : null;
  }, [params.slug]);

  const selectionSlugRef = useRef<string | null>(null);
  const previousSlugRef = useRef(productSlug);

  if (previousSlugRef.current !== productSlug) {
    selectionSlugRef.current = null;
    previousSlugRef.current = productSlug;
  }

  const displayProduct = useMemo(() => {
    if (currentDetailProduct && currentDetailProduct.slug === productSlug) {
      return currentDetailProduct;
    }

    if (currentDetailProduct && selectionSlugRef.current === productSlug) {
      return currentDetailProduct;
    }

    if (productSlug && products.length > 0) {
      return products.find((p) => p.slug === productSlug) || null;
    }

    return null;
  }, [currentDetailProduct, products, productSlug]);

  useEffect(() => {
    if (productSlug && currencyCode) {
      loadProductPageData(productSlug, currencyCode, countryCode, userId);
    }
  }, [productSlug, currencyCode, countryCode, loadProductPageData, userId]);

  const handleProductSelect = useCallback((selectedProduct: EcommerceProduct) => {
    selectionSlugRef.current = productSlug;
    setCurrentDetailProduct(selectedProduct);
  }, [setCurrentDetailProduct]);

  const handleRefresh = () => {
    if (productSlug && currencyCode) {
      loadProductPageData(productSlug, currencyCode , countryCode, userId);
    }
  };

  const isNetworkError =
    detailError &&
    (detailError.includes("Network Error") ||
      detailError.includes("Failed to fetch") ||
      detailError.includes("ECONNREFUSED") ||
      detailError.includes("timeout"));

  if (!displayProduct && isDetailLoading) {
    return <ProductDetailLoadingState />;
  }

  if (!displayProduct && detailError) {
    if (isNetworkError) {
      return (
        <EcommerceSkeletonLoader
          networkError={ecommerceData.messages.networkError}
          refreshButtonLabel={ecommerceData.messages.refreshButton}
          onRefresh={handleRefresh}
        />
      );
    } else {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">{detailError}</Alert>
        </Container>
      );
    }
  }

  if (!displayProduct) return null;

  return (
    <Box sx={{ bgcolor: ecommerceData.ui.colors.productDetailBackground, minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
          <ProductDetailImageSection
            product={displayProduct}
            previewProducts={detailPreviewProducts}
            onProductSelect={handleProductSelect}
            arePreviewsLoading={arePreviewsLoading}
          />

          <ProductDetailInfoSection
            product={displayProduct}
            detailsLoading={isDetailLoading}
          />
        </Box>
      </Container>

      {/* Related Products Section */}
      {detailRelatedProducts.length > 0 && (
        <RelatedProductsSection
          products={detailRelatedProducts}
          arePreviewsLoading={arePreviewsLoading}
        />
      )}
    </Box>
  );
}
