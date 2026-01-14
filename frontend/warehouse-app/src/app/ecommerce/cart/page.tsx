"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container } from "@mui/material";
import { useSession } from "next-auth/react";

import { useLocationStore } from "@/store/locationStore";
import { useCartHasHydrated, useCartStore } from "@/store/cartStore";
import CartItemsList from "@/components/ecommerce/cart/CartItemsList";
import OrderSummaryCard from "@/components/ecommerce/cart/OrderSummaryCard";
import EmptyCartState from "@/components/ecommerce/cart/EmptyCartState";
import CartSkeletonLoader from "@/components/ecommerce/cart/CartSkeletonLoader";
import ContinueShoppingCard from "@/components/ecommerce/cart/ContinueShoppingCard";
import AddressSection from "@/components/ecommerce/cart/AddressSection";
import CartLoginState from "@/components/ecommerce/cart/CartLoginState";
import OrderSummarySkeleton from "@/components/ecommerce/skeleton-loader/OrderSummarySkeleton";
import CartItemsSkeleton from "@/components/ecommerce/skeleton-loader/CartItemsSkeleton";
import { CartAddressData } from "@/types/ecommerce";

export default function CartPage() {
  const { data: session, status } = useSession();
  const hydrated = useCartHasHydrated();
  const { currencyCode, isLoaded: locationLoaded } = useLocationStore();
  const { cartProducts, getCart, checkoutProducts, setCheckoutProducts } = useCartStore();

  const [selectedAddress, setSelectedAddress] = useState<CartAddressData | null>(null);
  const [highlightAddressError, setHighlightAddressError] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isAddressDataReady, setIsAddressDataReady] = useState(false);


  const userId = (session?.user as any)?.user_id;

  const handleAddressFetchComplete = useCallback(() => {
    setIsAddressDataReady(true);
  }, []);

  const initCart = useCallback(async () => {
    setIsCartLoading(true);
    try {
      await getCart(currencyCode);
    } catch (e) {
      console.error("Initialization error:", e);
    } finally {
      setIsCartLoading(false);
    }
  }, [getCart, currencyCode]);

  useEffect(() => {
    if (status === "loading") return;
    if (!currencyCode) return;

    if (!locationLoaded) return;

    if (hydrated) {
      initCart();
    } else {
      const unsub = useCartStore.persist.onFinishHydration(() => initCart());
      const timer = setTimeout(() => initCart(), 3000);

      return () => {
        unsub();
        clearTimeout(timer);
      };
    }
  }, [currencyCode, status, initCart, hydrated, userId, locationLoaded]);

  useEffect(() => {
    if (hydrated && cartProducts.length > 0) {
      const validItems = cartProducts.filter(item => item && item.product);
      const allIds = validItems.map(item => item.product_id).filter((id): id is string => !!id);
      if (allIds.length > 0) {
        const cleanCheckoutProducts = checkoutProducts.filter(id => allIds.includes(id));

        if (cleanCheckoutProducts.length !== checkoutProducts.length) {
          setCheckoutProducts(cleanCheckoutProducts);
        }
      }
    }
  }, [hydrated, cartProducts, checkoutProducts, setCheckoutProducts]);

  if (status === "loading" || !hydrated) {
    return <CartSkeletonLoader />;
  }

  if (!isCartLoading && (!cartProducts || cartProducts.length === 0)) {
    return <EmptyCartState/>;
  }

  const validItems = cartProducts.filter(item => item && item.product);

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Cart Items Section */}
          <Box sx={{ flex: { md: "0 0 65%" }, width: { xs: "100%", md: "65%" } }}>
            {!userId ? (
              <CartLoginState />
            ) : (
              <AddressSection
                userId={userId}
                onAddressChange={setSelectedAddress}
                highlightAddressError={highlightAddressError}
                onAddressFetchComplete={handleAddressFetchComplete}
              />
            )}
            {isCartLoading ? (
              <CartItemsSkeleton />
            ) : (
              <CartItemsList
                items={validItems}
                selectedItems={new Set(checkoutProducts)}
                selectedCurrency={currencyCode}
              />
            )}

            <ContinueShoppingCard />
          </Box>

          {/* Order Summary Section */}
          <Box sx={{ flex: { md: "0 0 35%" }, width: { xs: "100%", md: "35%" } }}>
            {isCartLoading ? (
              <OrderSummarySkeleton />
            ) : (
              <OrderSummaryCard
                userId={userId}
                items={validItems}
                selectedCurrency={currencyCode}
                selectedAddress={selectedAddress}
                setHighlightAddressError={setHighlightAddressError}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}