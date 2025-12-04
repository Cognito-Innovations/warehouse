"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Container } from "@mui/material";
import { useSession } from "next-auth/react";

import { useCartHasHydrated, useCartStore } from "@/store/cartStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import CartHeader from "@/components/ecommerce/cart/CartHeader";
import CartItemsList from "@/components/ecommerce/cart/CartItemsList";
import OrderSummaryCard from "@/components/ecommerce/cart/OrderSummaryCard";
import EmptyCartState from "@/components/ecommerce/cart/EmptyCartState";
import CartSkeletonLoader from "@/components/ecommerce/cart/CartSkeletonLoader";
import ContinueShoppingCard from "@/components/ecommerce/cart/ContinueShoppingCard";
import AddressSection from "@/components/ecommerce/cart/AddressSection";
import CartLoginState from "@/components/ecommerce/cart/CartLoginState";
import OrderSummarySkeleton from "@/components/ecommerce/skeleton-loader/OrderSummarySkeleton";
import CartItemsSkeleton from "@/components/ecommerce/skeleton-loader/CartItemsSkeleton";
import { getCurrencyForCountry } from "@/utils/currency";
import { getCartItemPricingSummary } from "@/utils/priceUtils";
import { CartAddressData } from "@/types/ecommerce";

export default function CartPage() {
  const { data: session, status } = useSession();
  const hydrated = useCartHasHydrated();
  const {
    cartProducts,
    getCart,
    checkoutProducts,
  } = useCartStore();

  const [selectedAddress, setSelectedAddress] = useState<CartAddressData | null>(null);
  const [highlightAddressError, setHighlightAddressError] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false); 

  const { location, refreshAddresses } = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const selectedCountry = location.countryName;

  const userId = (session?.user as any)?.user_id;

  const initCart = useCallback(async () => {
    try {
      await getCart(selectedCountry);
    } catch (e) {
      console.error("Initialization error:", e);
    }
  }, [getCart, selectedCountry]);

  useEffect(() => {
    if (status === "loading") return;
    if (!selectedCountry) return;

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
  }, [selectedCountry, status, initCart, hydrated]);

  if (status === "loading" || !hydrated) {
    return <CartSkeletonLoader />;
  }

  if (!cartProducts || cartProducts.length === 0) {
    return <EmptyCartState/>
  }

  const validItems = cartProducts.filter(item => item && item.product);

  const getCurrencySymbol = () => {
    if (validItems.length > 0) {
      const firstSelected = validItems.find((item) =>
        checkoutProducts.includes(item.product_id!)
      );
      
      if (firstSelected) {
        const pricing = getCartItemPricingSummary(firstSelected);
        if (pricing.currency) return pricing.currency;
      }
    }
    return currencyInfo.symbol;
  };

  const currencyInfo = getCurrencyForCountry(selectedCountry!);
  const currencySymbol = getCurrencySymbol();

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <CartHeader />

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
                refreshAddresses={refreshAddresses}
              />
            )}
            {isCartLoading ? (
              <CartItemsSkeleton />
            ) : (
              <CartItemsList
                items={validItems}
                selectedItems={new Set(checkoutProducts)}
                currencySymbol={currencySymbol}
                selectedCountry={selectedCountry}
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
                selectedCountry={selectedCountry}
                selectedAddress={selectedAddress}
                setHighlightAddressError={setHighlightAddressError}
                currencySymbol={currencySymbol}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}