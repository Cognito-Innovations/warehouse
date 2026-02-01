"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Box, Container, CircularProgress, Grid, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/store/cartStore";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { useCheckout } from "@/store/useCheckout";
import { useAuth } from "@/contexts/AuthContext";
import { FastDeliveryBanner } from "@/components/ecommerce/checkout/FastDeliveryBanner";
import { DeliveryInfoCard } from "@/components/ecommerce/checkout/DeliveryInfoCard";
import { OrderSummary } from "@/components/ecommerce/checkout/OrderSummary";
import DeliveryAddressCard from "@/components/ecommerce/checkout/DeliveryAddressCard";
import { ROUTES } from "@/utils/constants";
import { calculateCartTotals } from "@/utils/cartCalculations";
import { formatPrice } from "@/utils/priceUtils";
import { CartItem, ComputedCart } from "@/types/ecommerce";
import { ecommerceService } from "@/services/ecommerce.service";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [checkedOutItems, setCheckedOutItems] = useState<CartItem[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState(false); 
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [totalDeliveryFee, setTotalDeliveryFee] = useState(0);

  const initializationStarted = useRef(false);

  const { currencyCode, currencySymbol, countryCode } = useDetectUserLocation();
  const { selectedProductIds } = useCheckout();

  const loadCheckoutData = async () => {
    const currentCheckoutProducts = selectedProductIds;

    if (!currentCheckoutProducts || currentCheckoutProducts.length === 0) {
      toast.error("Checkout session expired. Please review your cart.");
      router.replace(ROUTES.CART);
      return;
    }

    try {
      const checkoutData: ComputedCart = await ecommerceService.postCheckout(
        currencyCode, 
        countryCode,
        currentCheckoutProducts
      );

      if (checkoutData && checkoutData.items && checkoutData.items.length > 0) {
        setCheckedOutItems(checkoutData.items as CartItem[]);
        setTotalDeliveryFee(checkoutData.total_delivery_fee ?? 0);

        try {
          useCartStore.getState().setCartProducts(checkoutData.items);
          const itemProductIds = checkoutData.items.map(item => item.product_id!);
          useCartStore.getState().toggleCartItemSelection(itemProductIds);
        } catch (storeError) {
          console.warn("Failed to sync with store", storeError);
        }

        setItemsLoaded(true);
      } else {
        console.error("Checkout API returned no items", checkoutData);
        setItemsLoaded(true);
      }
    } catch (error: any) {
      console.error("Checkout load failed", error);

      const message =
        error?.response?.data?.message ||
        "Unable to proceed with checkout. Please review your cart.";

      toast.error(message);
      setItemsLoaded(true);
      router.replace(ROUTES.CART);
    }
  };

  useEffect(() => {
    if (currencyCode && !initializationStarted.current) {
      initializationStarted.current = true;
      loadCheckoutData();
    }
  }, [currencyCode, countryCode]); 

  useEffect(() => {
    if (itemsLoaded && checkedOutItems.length === 0 && !orderPlaced) {
      router.replace(ROUTES.CART);
    }
  }, [checkedOutItems, router, itemsLoaded, orderPlaced]);

  const stockWarnings = useMemo(() => {
    return checkedOutItems.filter(
      (item: any) =>
        item.requested_quantity &&
        item.quantity < item.requested_quantity
    );
  }, [checkedOutItems]);

  const selectedIds = useMemo(() => new Set(checkedOutItems.map(item => item.product_id!)), [checkedOutItems]);
  const totals = useMemo(
    () => 
      calculateCartTotals(
        checkedOutItems,
        selectedIds,
        currencyCode,
        currencySymbol,
        totalDeliveryFee
      ), [checkedOutItems, selectedIds, currencyCode, totalDeliveryFee]);
  const formatLocalPrice = useCallback((amount: number) => formatPrice(amount, currencySymbol), [currencySymbol]);

  const handleAddressSelect = useCallback((address: string) => {
    setShippingAddress(address);
  }, []);

  const handleAddressLoadingChange = useCallback((isLoading: boolean) => {
    setAddressLoading(isLoading);
  }, []);

  if (!itemsLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if ((!checkedOutItems || checkedOutItems.length === 0) && !orderPlaced) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <FastDeliveryBanner />
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <DeliveryAddressCard 
                  userId={user?.id}
                  onAddressSelect={handleAddressSelect}
                  onLoadingChange={handleAddressLoadingChange}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <DeliveryInfoCard />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: { lg: "sticky" }, top: { lg: 20 } }}>
              {stockWarnings.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {stockWarnings.length === 1
                    ? "An item had limited stock. Quantity was adjusted based on availability."
                    : `${stockWarnings.length} items had limited stock. Quantities were adjusted based on availability.`}
                </Alert>
              )}

              <OrderSummary 
                items={checkedOutItems}
                totals={totals}
                shippingAddress={shippingAddress}
                user={user}
                formatLocalPrice={formatLocalPrice}
                addressLoading={addressLoading}
                onOrderSuccess={() => setOrderPlaced(true)}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}