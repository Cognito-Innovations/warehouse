"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useSession } from "next-auth/react";

import { useCartHasHydrated, useCartStore } from "@/store/cartStore";
import { useCheckout } from "@/store/useCheckout";
import { ecommerceService } from "@/services/ecommerce.service";
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
import ReadOnlyCartItems from "@/components/ecommerce/cart/ReadOnlyCartItems";
import CargoGroupedCart from "@/components/ecommerce/cart/CargoGroupedCart";
import { CartAddressData, DeliveryOption } from "@/types/ecommerce";
import { normalizeCart } from "@/lib/utils";

type CartStep = 0 | 1 | 2;

export default function CartPage() {
  const { data: session, status } = useSession();
  const hydrated = useCartHasHydrated();
  const { 
    cart,
    getCart,
  } = useCartStore();
  const { selectedCargo } = useCheckout();

  const [selectedAddress, setSelectedAddress] = useState<CartAddressData | null>(null);
  const [highlightAddressError, setHighlightAddressError] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isAddressDataReady, setIsAddressDataReady] = useState(false);
  const [activeStep, setActiveStep] = useState<CartStep>(0);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption | null>(null);  
  const [groupedCart, setGroupedCart] = useState<any>(null);
  const [hasFetchedCart, setHasFetchedCart] = useState(false);

  const userId = (session?.user as any)?.user_id;

  const fetchGroupedCart = useCallback(async () => {
    const res = await ecommerceService.getCartGroupedByCargo(
      userId
    );
    setGroupedCart(res.items);
  }, [userId]);

  useEffect(() => {
    if (activeStep === 0) {
      fetchGroupedCart();
    }
  }, [activeStep, fetchGroupedCart]);

  const handleAddressFetchComplete = useCallback(() => {
    setIsAddressDataReady(true);
  }, []);

  const handleAddressSelect = useCallback((address: CartAddressData | null) => {
    setSelectedAddress(address);
    // Don't auto-advance - let user manually proceed to next step
  }, []);

  const handleDeliveryOptionSelect = useCallback(async (option: DeliveryOption) => {
    setSelectedDeliveryOption(option);
    try {
      await ecommerceService.selectDeliveryOption(option);
      await getCart();
    } catch (err) {
      console.error('Failed to save delivery option:', err);
    }
  }, []);

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
      await ecommerceService.fetchCart();
    } catch (e) {
      console.error("Initialization error:", e);
    } finally {
      setIsCartLoading(false);
      setHasFetchedCart(true);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;

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
  }, [status, initCart, hydrated, userId]);

  // Auto-advance step based on selections
  useEffect(() => {
    if (activeStep === 0 && selectedAddress && userId) {
      // Don't auto-advance, let user click continue
    } else if (activeStep === 1 && selectedDeliveryOption) {
      // Don't auto-advance, let user click continue
    }
  }, [activeStep, selectedAddress, selectedDeliveryOption, userId]);
  
  if (status === "loading" || !hydrated) {
    return <CartSkeletonLoader />;
  }

  if (hasFetchedCart && !isCartLoading && (!cart || cart.length === 0)) {
    return <EmptyCartState/>;
  }

  const safeCart = normalizeCart(cart);
  const validItems = safeCart.filter(item => item && item.product);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            {!userId ? (
              <CartLoginState />
            ) : (
              <>
                <AddressSection
                  userId={userId}
                  onAddressChange={handleAddressSelect}
                  highlightAddressError={highlightAddressError}
                  onAddressFetchComplete={handleAddressFetchComplete}
                  initialAddress={selectedAddress}
                />
                {/* Continue button to proceed to delivery step */}
               
              </>
            )}
            {isCartLoading ? (
              <CartItemsSkeleton />
            ) : (
              groupedCart && (
                <CargoGroupedCart
                  groupedItems={groupedCart}
                />
              )
            )}
            {/* Action buttons at bottom */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column-reverse", sm: "row" },
                justifyContent: { xs: "flex-start", sm: "space-between" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: { xs: 1.5, sm: 2 },
                mt: 2,
                mb: { xs: 1, sm: 0 },
              }}
            >
              <ContinueShoppingCard />
              {selectedCargo && selectedAddress && (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => setActiveStep(1)}
                  disabled={!selectedAddress || !isAddressDataReady || isCartLoading}
                  fullWidth={false}
                  sx={{
                    textTransform: "none",
                    bgcolor: "primary.main",
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.25 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    minWidth: { xs: "auto", sm: 180 },
                    flex: { xs: "1 1 auto", sm: "0 0 auto" },
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "grey.400",
                      color: "grey.700",
                    },
                  }}
                >
                  Continue to Delivery
                </Button>
              )}
            </Box>
          </>
        );
      case 1:
        return (
          <>
            {/* Step 1: Delivery Selection - NO cart items shown */}
            <DeliveryModelSelection
              selectedOption={selectedDeliveryOption}
              onSelectOption={handleDeliveryOptionSelect}
              onBack={handleBackToAddress}
              onContinue={handleContinueToReview}
            />
            {/* Cart items removed from this step - users can't edit during delivery selection */}
          </>
        );
      case 2:
        return (
          <>
            {/* Step 2: Order Summary - Show read-only cart items for final review */}
            {isCartLoading ? (
              <CartItemsSkeleton />
            ) : (
              <ReadOnlyCartItems
                items={validItems as any}
              />
            )}
            {/* Note: Order Summary card is shown on the right side */}
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
            flexDirection: { xs: "column", md: activeStep === 2 ? "row" : "column" },
            gap: { xs: 2, sm: 3 },
            alignItems: { xs: "stretch", md: "flex-start" },
          }}
        >
          {/* Main Content Section */}
          <Box sx={{ 
            flex: { md: activeStep === 2 ? "0 0 65%" : "1" }, 
            width: { xs: "100%", md: activeStep === 2 ? "65%" : "100%" },
            minWidth: 0, // Prevents overflow
          }}>
            {renderStepContent()}
          </Box>

          {/* Order Summary Section - Only show in step 2 (Order Summary) */}
          {activeStep === 2 && (
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
                  selectedAddress={selectedAddress}
                  setHighlightAddressError={setHighlightAddressError}
                  selectedDeliveryOption={selectedDeliveryOption}
                  onBackToDelivery={handleBackToDelivery}
                  onEditAddress={handleEditAddress}
                />
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}