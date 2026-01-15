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
import CartStepper from "@/components/ecommerce/cart/CartStepper";
import DeliveryModelSelection from "@/components/ecommerce/cart/DeliveryModelSelection";
import { CartAddressData, DeliveryOption } from "@/types/ecommerce";

type CartStep = 0 | 1 | 2;

export default function CartPage() {
  const { data: session, status } = useSession();
  const hydrated = useCartHasHydrated();
  const { currencyCode, countryCode, isLoaded: locationLoaded } = useLocationStore();
  const { 
    cartProducts, 
    getCart, 
    checkoutProducts, 
    setCheckoutProducts,
    selectedDeliveryOption,
    setSelectedDeliveryOption,
  } = useCartStore();

  const [selectedAddress, setSelectedAddress] = useState<CartAddressData | null>(null);
  const [highlightAddressError, setHighlightAddressError] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isAddressDataReady, setIsAddressDataReady] = useState(false);
  const [activeStep, setActiveStep] = useState<CartStep>(0);


  const userId = (session?.user as any)?.user_id;

  const handleAddressFetchComplete = useCallback(() => {
    setIsAddressDataReady(true);
  }, []);

  const handleAddressSelect = useCallback((address: CartAddressData | null) => {
    setSelectedAddress(address);
    if (address) {
      setActiveStep(1); // Move to delivery selection step
    }
  }, []);

  const handleDeliveryOptionSelect = useCallback((option: DeliveryOption) => {
    setSelectedDeliveryOption(option);
  }, [setSelectedDeliveryOption]);

  const handleBackToAddress = useCallback(() => {
    setActiveStep(0);
  }, []);

  const handleContinueToReview = useCallback(() => {
    if (selectedDeliveryOption) {
      setActiveStep(2); // Move to order summary step
    }
  }, [selectedDeliveryOption]);

  const handleBackToDelivery = useCallback(() => {
    setActiveStep(1);
  }, []);

  const handleEditAddress = useCallback(() => {
    setActiveStep(0); // Go back to address selection step
  }, []);

  const initCart = useCallback(async () => {
    setIsCartLoading(true);
    try {
      await getCart(currencyCode, countryCode);
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

  // Auto-advance step based on selections
  useEffect(() => {
    if (activeStep === 0 && selectedAddress && userId) {
      // Don't auto-advance, let user click continue
    } else if (activeStep === 1 && selectedDeliveryOption) {
      // Don't auto-advance, let user click continue
    }
  }, [activeStep, selectedAddress, selectedDeliveryOption, userId]);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            {!userId ? (
              <CartLoginState />
            ) : (
              <AddressSection
                userId={userId}
                onAddressChange={handleAddressSelect}
                highlightAddressError={highlightAddressError}
                onAddressFetchComplete={handleAddressFetchComplete}
                initialAddress={selectedAddress}
              />
            )}
            {isCartLoading ? (
              <CartItemsSkeleton />
            ) : (
              <CartItemsList
                items={validItems as any}
                loadingStates={{}}
                selectedItems={new Set(checkoutProducts)}
                selectedCurrency={currencyCode}
              />
            )}
            <ContinueShoppingCard />
          </>
        );
      case 1:
        return (
          <>
            <DeliveryModelSelection
              countryCode={countryCode}
              selectedOption={selectedDeliveryOption}
              onSelectOption={handleDeliveryOptionSelect}
              onBack={handleBackToAddress}
              onContinue={handleContinueToReview}
            />
            {isCartLoading ? (
              <CartItemsSkeleton />
            ) : (
              <CartItemsList
                items={validItems as any}
                loadingStates={{}}
                selectedItems={new Set(checkoutProducts)}
                selectedCurrency={currencyCode}
              />
            )}
            <ContinueShoppingCard />
          </>
        );
      case 2:
        return (
          <>
            {/* Order Summary step - no cart items list to prevent editing during checkout */}
            {/* Users can go back to previous steps if they need to modify cart */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", pb: { xs: 2, md: 0 } }}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 3 },
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <CartStepper activeStep={activeStep} />
        
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, sm: 3 },
            alignItems: { xs: "stretch", md: "flex-start" },
          }}
        >
          {/* Cart Items Section */}
          <Box sx={{ 
            flex: { md: "0 0 65%" }, 
            width: { xs: "100%", md: "65%" },
            minWidth: 0, // Prevents overflow
          }}>
            {renderStepContent()}
          </Box>

          {/* Order Summary Section */}
          <Box sx={{ 
            flex: { md: "0 0 35%" }, 
            width: { xs: "100%", md: "35%" },
            minWidth: 0, // Prevents overflow
            order: { xs: -1, md: 0 }, // Show summary first on mobile for better UX
          }}>
            {isCartLoading ? (
              <OrderSummarySkeleton />
            ) : (
              <OrderSummaryCard
                userId={userId}
                items={validItems as any}
                selectedCurrency={currencyCode}
                selectedAddress={selectedAddress}
                setHighlightAddressError={setHighlightAddressError}
                selectedDeliveryOption={selectedDeliveryOption}
                onBackToDelivery={activeStep === 2 ? handleBackToDelivery : undefined}
                onEditAddress={activeStep === 2 ? handleEditAddress : undefined}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}