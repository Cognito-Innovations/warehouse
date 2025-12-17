"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Container, CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import { CheckoutHeader } from "@/components/ecommerce/checkout/CheckoutHeader";
import { FastDeliveryBanner } from "@/components/ecommerce/checkout/FastDeliveryBanner";
import { DeliveryInfoCard } from "@/components/ecommerce/checkout/DeliveryInfoCard";
import { OrderSummary } from "@/components/ecommerce/checkout/OrderSummary";
import DeliveryAddressCard from "@/components/ecommerce/checkout/DeliveryAddressCard";
import { ROUTES } from "@/utils/constants";
import { calculateCartTotals } from "@/utils/cartCalculations";
import { formatPrice } from "@/utils/priceUtils";
import { CartItem } from "@/types/ecommerce";

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutProducts, cartProducts } = useCartStore();
  const toggleCartItemSelection = useCartStore.getState().toggleCartItemSelection;
  const { user, loading: authLoading } = useAuth();

  const [shippingAddress, setShippingAddress] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [checkedOutItems, setCheckedOutItems] = useState<CartItem[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const selectedCurrency = locationData.currencyInfo.code;
  const currencyInfo = locationData.currencyInfo;

  useEffect(() => {
    if (hasInitialized) return;

    const cached = localStorage.getItem("checkoutSelectedItems");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        let parsedItems: CartItem[] = [];
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            const ids = parsed as string[];
            parsedItems = cartProducts.filter((item) => ids.includes(item.id!));
          } else {
            parsedItems = parsed as CartItem[];
          }
        }
        if (parsedItems.length === 0) {
          throw new Error('No valid items');
        }
        setCheckedOutItems(parsedItems);
        const itemProductIds = parsedItems.map(item => item.product_id!);
        toggleCartItemSelection(itemProductIds);
      } catch (err) {
        console.error("Failed to parse cached items:", err);
        setCheckedOutItems([]);
      }
      setHasInitialized(true);
      setItemsLoaded(true);
      return;
    }

    const selected = cartProducts.filter(i =>
      checkoutProducts.includes(i.product_id!)
    );
    setCheckedOutItems(selected);
    const itemProductIds = selected.map(i => i.product_id!);
    toggleCartItemSelection(itemProductIds);
    setHasInitialized(true);
    setItemsLoaded(true);
  }, [cartProducts, checkoutProducts, toggleCartItemSelection, hasInitialized]);

  useEffect(() => {
    if (itemsLoaded && checkedOutItems.length === 0 && !orderPlaced) {
      router.replace(ROUTES.CART);
    }
  }, [checkedOutItems, router, itemsLoaded, orderPlaced]);

  const selectedIds = useMemo(() => new Set(checkedOutItems.map(item => item.product_id!)), [checkedOutItems]);
  const totals = useMemo(() => calculateCartTotals(checkedOutItems, selectedIds, selectedCurrency, currencyInfo), [checkedOutItems, selectedIds, selectedCurrency, currencyInfo]);
  
  const formatLocalPrice = useCallback((amount: number) => formatPrice(amount, currencyInfo.symbol), [currencyInfo.symbol]);

  const handleAddressSelect = useCallback((address: string) => {
    setShippingAddress(address);
  }, []);

  const handleAddressLoadingChange = useCallback((isLoading: boolean) => {
    setAddressLoading(isLoading);
  }, []);

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if ((!checkedOutItems || checkedOutItems.length === 0) && itemsLoaded && !orderPlaced) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      <CheckoutHeader itemCount={checkedOutItems.length} />

      <Container maxWidth="lg" sx={{ py: { xs: 1, md: 3 }, px: { xs: 1, sm: 2 } }}>
        <FastDeliveryBanner />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Grid container spacing={3}>
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
            <OrderSummary 
              items={checkedOutItems}
              totals={totals}
              shippingAddress={shippingAddress}
              selectedCurrency={selectedCurrency}
              currencyInfo={currencyInfo}
              user={user}
              formatLocalPrice={formatLocalPrice}
              addressLoading={addressLoading}
              onOrderSuccess={() => setOrderPlaced(true)}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}