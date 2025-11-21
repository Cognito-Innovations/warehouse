"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Alert } from "@mui/material";
import { useParams, useRouter } from "next/navigation";

import { useProducts, useProductActions } from "../../../../store/ecommerceStore";
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
  const { fetchProducts } = useProductActions();

  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<EcommerceProduct | null>(null);
 
  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const countryName = locationData.location.countryName;

  const fetchProductById = useCallback(async (id: string, code?: string) => {
    setLoading(true);
    setErrorState(null);
    try {
      const product = await ecommerceService.getProduct(id, code);
      setCurrentProduct(product);
    } catch (err: any) {
      setErrorState(err.message || ecommerceData.productDetail.productNotFound);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (countryName && products.length === 0) {
      fetchProducts(countryName).catch((err) => {});
    }
  }, [countryName, fetchProducts, products.length]);

  // Handle product loading when params.id changes
  useEffect(() => {
    if (params.id && typeof params.id === "string" && countryName) {
      fetchProductById(params.id, countryName);
    }
  }, [params.id, countryName, fetchProductById]);

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

  const handleProductClick = useCallback((product: EcommerceProduct) => {
    router.push(`${ROUTES.PRODUCT}/${product.id}`);
  }, [router]);


  const handleRefresh = () => {
    setLoading(true);
    setErrorState(null);
    if (params.id && typeof params.id === "string" && countryName !== undefined) {
      fetchProductById(params.id, countryName);
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
          />
        </Box>
      </Container>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <RelatedProductsSection
          products={relatedProducts}
          onProductClick={handleProductClick}
        />
      )}
    </Box>
  );
}
