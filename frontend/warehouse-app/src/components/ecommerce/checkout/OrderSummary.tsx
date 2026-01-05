"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { toast } from "sonner";
import { getUSDFromLocal } from "@/utils/priceUtils";

import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem } from "@/types/ecommerce";
import { CurrencyInfo } from "@/types/ecommerce";
import { OrderSuccessModal } from "../OrderSuccessModal";
import { usePayPalPayment } from "@/hooks/usePayPalPayment";
import { useOrderPayment } from "@/hooks/useOrderPayment";
import { OrderItemsList } from "./OrderItemsList";
import { OrderTotals } from "./OrderTotals";
import { PaymentButton } from "./PaymentButton";
import { PayPalButtonContainer } from "./PayPalButtonContainer";

interface OrderTotalsData {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxes: number;
  serviceCharge: number;
  total: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  totals: OrderTotalsData;
  shippingAddress: string;
  selectedCurrency?: string;
  currencyInfo: CurrencyInfo;
  user: any;
  formatLocalPrice: (amount: number) => string;
  addressLoading: boolean;
  onOrderSuccess?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  totals,
  shippingAddress,
  selectedCurrency,
  currencyInfo,
  formatLocalPrice,
  addressLoading,
  onOrderSuccess,
}) => {
  const { removePurchasedProducts } = useCartStore();
  const { loading: authLoading } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const formatUSDPrice = useCallback((localAmount: number) => {
    const usdAmount = getUSDFromLocal(localAmount, currencyInfo);
    return `$${usdAmount.toFixed(2)}`;
  }, [currencyInfo]);

  const { isProcessing, initiateOrder } = useOrderPayment();
  const { showPayPal, initializePayment, resetPayment } = usePayPalPayment({
    onSuccess: async () => {
      try {
        const purchasedIds = items.map((item) => item.product_id!);
        removePurchasedProducts(purchasedIds);
        onOrderSuccess?.();
        setShowSuccessModal(true);
        resetPayment();
      } catch (error) {
        toast.error("Order update error");
      }
    },
  });

  const handlePaymentAndOrder = useCallback(async () => {
    if (!items.length || !shippingAddress || authLoading) {
      toast.error("No items to checkout.");
      return;
    }

    resetPayment();

    const paymentConfig = await initiateOrder(items, shippingAddress);

    if (paymentConfig) {
      initializePayment(paymentConfig);
    }
  }, [
    items,
    shippingAddress,
    authLoading,
    initiateOrder,
    initializePayment,
    resetPayment,
  ]);

  const hasAddress = !!shippingAddress && shippingAddress.trim().length > 0;
  const isButtonDisabled =
    isProcessing ||
    !hasAddress ||
    authLoading ||
    addressLoading ||
    items.length === 0 ||
    showPayPal;

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{
          mb: { xs: 2, md: 3 },
          borderRadius: 3,
          border: "1px solid #e9ecef",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            mb={2}
            sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
          >
            <Payment
              sx={{
                color: "primary.main",
                fontSize: { xs: 24, md: 28 },
              }}
            />
            <Typography
              variant="h6"
              fontWeight={600}
              color="text.primary"
              sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
            >
              Order Summary
            </Typography>
          </Stack>

          <OrderItemsList
            items={items}
            currencyInfo={currencyInfo}
            formatLocalPrice={formatLocalPrice}
            formatUSDPrice={formatUSDPrice}
          />

          <OrderTotals
            subtotal={totals.subtotal}
            discount={totals.discount}
            deliveryFee={totals.deliveryFee}
            taxes={totals.taxes}
            serviceCharge={totals.serviceCharge}
            total={totals.total}
            formatLocalPrice={formatLocalPrice}
            formatUSDPrice={formatUSDPrice}
          />
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        {showPayPal ? (
          <PayPalButtonContainer />
        ) : (
          <PaymentButton
            processing={isProcessing}
            addressLoading={addressLoading}
            disabled={isButtonDisabled}
            total={totals.total}
            formatLocalPrice={formatLocalPrice}
            formatUSDPrice={formatUSDPrice}
            onClick={handlePaymentAndOrder}
          />
        )}
      </Box>

      <Box sx={{ mt: { xs: 1.5, md: 2 }, textAlign: "center", px: { xs: 1, md: 0 } }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
        >
          By placing your order, you agree to our Terms of Service
        </Typography>
      </Box>

      <OrderSuccessModal
        open={showSuccessModal}
        onContinueShopping={() => setShowSuccessModal(false)}
        onViewOrders={() => setShowSuccessModal(false)}
      />
    </Box>
  );
};