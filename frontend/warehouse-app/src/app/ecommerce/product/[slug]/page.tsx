"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { Box, Container, Alert } from "@mui/material";
import { useParams, useRouter } from "next/navigation";

import useProductStore from "@/store/productStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
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
 
  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const countryName = locationData.location.countryName;

  const productSlug = useMemo(() => {
    return params.slug && typeof params.slug === "string" ? params.slug : null;
  }, [params.slug]);

  const displayProduct = useMemo(() => {
    if (currentDetailProduct && currentDetailProduct.id === productSlug) {
      return currentDetailProduct;
    }

    if (productSlug && products.length > 0) {
      return products.find((p) => p.slug === productSlug) || null;
    }

    return null;
  }, [currentDetailProduct, products, productSlug]);

  useEffect(() => {
    if (productSlug && countryName) {
      loadProductPageData(productSlug, countryName);
    }
  }, [productSlug, countryName, loadProductPageData]);

  const handleProductSelect = useCallback((selectedProduct: EcommerceProduct) => {
    setCurrentDetailProduct(selectedProduct);
  }, [setCurrentDetailProduct]);

  const handleProductClick = useCallback((product: EcommerceProduct) => {
    router.push(`${ROUTES.PRODUCT}/${product.slug}`);
  }, [router]);

  const handleRefresh = () => {
    if (productSlug && countryName) {
      loadProductPageData(productSlug, countryName);
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
      <ProductDetailHeader />

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
          onProductClick={handleProductClick}
        />
      )}
    </Box>
  );
}
