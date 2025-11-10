"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Alert } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceProduct } from "@/types/ecommerce";
import { ecommerceService } from "@/services/ecommerce.service";
import { useProducts, useCart, useCartActions, useProductActions } from "../../../../store/ecommerceStore";
import ProductDetailLoadingState from "@/components/ecommerce/ProductDetailLoadingState";
import ProductDetailHeader from "@/components/ecommerce/ProductDetailHeader";
import ProductDetailImageSection from "@/components/ecommerce/ProductDetailImageSection";
import ProductDetailInfoSection from "@/components/ecommerce/ProductDetailInfoSection";
import ProductDetailTabs from "@/components/ecommerce/ProductDetailTabs";
import RelatedProductsSection from "@/components/ecommerce/RelatedProductsSection";
import EcommerceSkeletonLoader from "@/components/ecommerce/EcommerceSkeletonLoader";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { products } = useProducts();
  const { cart, itemCount } = useCart();
  const { addToCart, updateCartItem, removeFromCart, fetchCart } = useCartActions();
  const { fetchProducts } = useProductActions();
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<EcommerceProduct | null>(null);
  const [isCartActionLoading, setIsCartActionLoading] = useState(false);
  const [isIncrementLoading, setIsIncrementLoading] = useState(false);
  const [isDecrementLoading, setIsDecrementLoading] = useState(false);
  const [displayedQuantity, setDisplayedQuantity] = useState<number | null>(null);

  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    setErrorState(null);
    try {
      const product = await ecommerceService.getProduct(id);
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
    fetchCart();
    fetchProducts();
  }, []); // Only run once on mount

  // Handle product loading when params.id changes
  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      const initialProduct = products.find((p: EcommerceProduct) => p.id === params.id);
      if (initialProduct) {
        setCurrentProduct(initialProduct);
        setLoading(false);
      } else {
        fetchProductById(params.id);
      }
    } else {
      setErrorState(ecommerceData.productDetail.productNotFound);
      setLoading(false);
    }
  }, [params.id, products, fetchProductById]);

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

  // Sync displayed quantity with cart when cart updates and not loading
  useEffect(() => {
    if (currentProduct && !isIncrementLoading && !isDecrementLoading && !isCartActionLoading) {
      const actualQuantity = getCartItemQuantity(currentProduct.id);
      setDisplayedQuantity(actualQuantity);
    }
  }, [cart, currentProduct, isIncrementLoading, isDecrementLoading, isCartActionLoading, getCartItemQuantity]);

  // Reset displayed quantity when product changes
  useEffect(() => {
    if (currentProduct) {
      const actualQuantity = getCartItemQuantity(currentProduct.id);
      setDisplayedQuantity(actualQuantity);
    }
  }, [currentProduct?.id, getCartItemQuantity]);

  const handleAddToCart = useCallback(async () => {
    if (currentProduct) {
      const stockQuantity = currentProduct.stock_quantity;
      const currentCartQuantity = getCartItemQuantity(currentProduct.id);
      if (currentCartQuantity + 1 > stockQuantity) {
        return;
      }
      setIsCartActionLoading(true);
      try {
        await addToCart(currentProduct.id, 1);
      } finally {
        setIsCartActionLoading(false);
      }
    }
  }, [currentProduct, getCartItemQuantity, addToCart]);

  const handleIncrement = useCallback(async () => {
    if (currentProduct) {
      const stockQuantity = currentProduct.stock_quantity;
      const currentCartQuantity = displayedQuantity !== null ? displayedQuantity : getCartItemQuantity(currentProduct.id);
      if (currentCartQuantity + 1 > stockQuantity || isIncrementLoading) {
        return;
      }
      setIsIncrementLoading(true);
      try {
        await addToCart(currentProduct.id, 1);
        // After API succeeds, update displayed quantity optimistically
        setDisplayedQuantity(currentCartQuantity + 1);
        // Cart state is already updated by addToCart, no need to fetch again
      } catch (err) {
        console.error("Failed to add to cart:", err);
        // On error, sync back to actual cart quantity
        setDisplayedQuantity(getCartItemQuantity(currentProduct.id));
      } finally {
        setIsIncrementLoading(false);
      }
    }
  }, [currentProduct, getCartItemQuantity, addToCart, displayedQuantity, isIncrementLoading]);

  const handleDecrement = useCallback(async () => {
    if (!currentProduct || isDecrementLoading) return;
    const cartItem = cart?.items.find((item) => item.product.id === currentProduct.id);
    if (!cartItem) return;
    
    const currentCartQuantity = displayedQuantity !== null ? displayedQuantity : cartItem.quantity;
    const newQuantity = currentCartQuantity - 1;
    
    if (newQuantity < 0) return;
    
    setIsDecrementLoading(true);
    try {
      if (newQuantity === 0) {
        // If quantity would be 0, remove from cart
        await removeFromCart(cartItem.id);
        // Set displayed quantity to 0 immediately since item is removed
        setDisplayedQuantity(0);
        // removeFromCart already calls fetchCart internally, no need to call again
      } else {
        // Otherwise, update quantity
        await updateCartItem(cartItem.id, newQuantity);
        // Update displayed quantity optimistically
        setDisplayedQuantity(newQuantity);
        // updateCartItem uses debouncing and calls fetchCart internally, no need to call again
      }
    } catch (err) {
      console.error("Failed to update cart:", err);
      // On error, sync back to actual cart quantity
      const actualQuantity = getCartItemQuantity(currentProduct.id);
      setDisplayedQuantity(actualQuantity);
    } finally {
      setIsDecrementLoading(false);
    }
  }, [currentProduct, cart, updateCartItem, removeFromCart, displayedQuantity, isDecrementLoading, getCartItemQuantity]);

  const handleGoToCart = useCallback(() => {
    router.push(ROUTES.CART);
  }, [router]);

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
    if (params.id && typeof params.id === "string") {
      fetchProductById(params.id);
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

  const price = parseFloat(String(currentProduct.price || "0"));
  const discountPercentage = parseFloat(String(currentProduct.discount_percentage || "0"));
  const discountPrice = price - (price * discountPercentage) / 100;
  const actualCartQuantity = getCartItemQuantity(currentProduct.id);
  // Use displayedQuantity if available (during loading), otherwise use actual cart quantity
  const cartQuantity = displayedQuantity !== null ? displayedQuantity : actualCartQuantity;
  const unitValue = parseFloat(String(currentProduct.unit_value || "0"));
  const measurementLabel = currentProduct.measurement?.label || "";
  const stockQuantity = currentProduct.stock_quantity;
  const isOutOfStock = stockQuantity === 0;
  const relatedProducts = getRelatedProducts(currentProduct);

  return (
    <Box sx={{ bgcolor: ecommerceData.ui.colors.productDetailBackground, minHeight: "100vh" }}>
      <ProductDetailHeader
        title={ecommerceData.productDetail.title}
        cartItemCount={itemCount}
        onBackClick={() => router.back()}
        onCartClick={() => router.push(ROUTES.CART)}
      />

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
          <ProductDetailImageSection
            product={currentProduct}
            previewProducts={previewProducts}
            selectedProductId={currentProduct.id}
            onProductSelect={handleProductSelect}
            defaultRating={ecommerceData.ratings.defaultRating}
            defaultReviewCount={ecommerceData.ratings.defaultReviewCount}
            promotionalBannerText={ecommerceData.promotional.bannerText}
            expiryLabel={ecommerceData.expiry.label}
            expiryDate={ecommerceData.expiry.defaultDate}
            starColor={ecommerceData.ui.colors.starColor}
            discountBadgeColor={ecommerceData.ui.colors.discountBadge}
            promotionalBannerColor={ecommerceData.ui.colors.promotionalBanner}
            expiryOverlayColor={ecommerceData.ui.colors.expiryOverlay}
            deliveryInformationLabel={ecommerceData.productDetail.deliveryInformation}
            freeDeliveryText={ecommerceData.productDetail.freeDeliveryThreshold}
            securePackagingText={ecommerceData.productDetail.securePackaging}
            deliveryIconColor={ecommerceData.ui.colors.deliveryIcon}
          />

          <ProductDetailInfoSection
            product={currentProduct}
            cartQuantity={cartQuantity}
            isCartActionLoading={isCartActionLoading}
            isIncrementLoading={isIncrementLoading}
            isDecrementLoading={isDecrementLoading}
            isOutOfStock={isOutOfStock}
            discountPrice={discountPrice}
            originalPrice={price}
            discountPercentage={discountPercentage}
            unitValue={unitValue}
            measurementLabel={measurementLabel}
            onAddToCart={handleAddToCart}
            onGoToCart={handleGoToCart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            defaultRating={ecommerceData.ratings.defaultRating}
            defaultReviewCount={ecommerceData.ratings.defaultReviewCount}
            selectedQuantityLabel={ecommerceData.productDetail.selectedQuantity}
            deliveryInformationLabel={ecommerceData.productDetail.deliveryInformation}
            freeDeliveryText={ecommerceData.productDetail.freeDeliveryThreshold}
            securePackagingText={ecommerceData.productDetail.securePackaging}
            offerTitle={ecommerceData.offers.wowDeal.title}
            offerBuyAt={ecommerceData.offers.wowDeal.buyAt}
            applyOffersText={ecommerceData.productDetail.applyOffers}
            addToCartLabel={ecommerceData.buttons.addToCart}
            goToCartLabel={ecommerceData.buttons.goToCart}
            addingLabel={ecommerceData.buttons.adding}
            outOfStockLabel={ecommerceData.buttons.outOfStock}
            quantityButtonBorderColor={ecommerceData.ui.colors.quantityButtonBorder}
            deliveryIconColor={ecommerceData.ui.colors.deliveryIcon}
            discountBadgeColor={ecommerceData.ui.colors.discountBadge}
            offerBackgroundColor={ecommerceData.ui.colors.offerBackground}
            promotionalBannerColor={ecommerceData.ui.colors.promotionalBanner}
          />
        </Box>

        {/* Product Detail Tabs */}
        <Container maxWidth="lg" sx={{ mt: 4, px: "-24px" }}>
          <ProductDetailTabs product={currentProduct} />
        </Container>
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
