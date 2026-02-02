"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import { Payment } from "@mui/icons-material";
import { toast } from "sonner";

import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { usePayPalPayment } from "@/hooks/usePayPalPayment";
import { useOrderPayment } from "@/hooks/useOrderPayment";
import { OrderSuccessModal } from "../OrderSuccessModal";
import { OrderItemsList } from "./OrderItemsList";
import { OrderTotals } from "./OrderTotals";
import { PaymentButton } from "./PaymentButton";
import { PayPalButtonContainer } from "./PayPalButtonContainer";
import { ProcessingPaymentDialog } from "./ProcessingPaymentDialog";
import { CartItem } from "@/types/ecommerce";
import { convertToUSD } from "@/utils/priceUtils";
import { DEFAULT_CURRENCY_INFO } from "@/utils/constants";

interface OrderTotalsData {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  // taxes: number;
  // serviceCharge: number;
  total: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  totals: OrderTotalsData;
  shippingAddress: string;
  user: any;
  formatLocalPrice: (amount: number) => string;
  addressLoading: boolean;
  onOrderSuccess?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  totals,
  shippingAddress,
  formatLocalPrice,
  addressLoading,
  onOrderSuccess,
}) => {
  const { currencyCode, currencyRate } = useDetectUserLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFinalizingPayment, setIsFinalizingPayment] = useState(false);

  const formatPriceWithOptionalLocal = useCallback((amount: number) => {
    const usdAmount = convertToUSD(amount, currencyCode, currencyRate);
    const usdText = `$${usdAmount.toFixed(2)}`;
    
    if (currencyCode === DEFAULT_CURRENCY_INFO.code) {
      return usdText;
    }

    return `${usdText} (${formatLocalPrice(amount)})`;
  }, [currencyCode, currencyRate]);

  const { isProcessing, initiateOrder } = useOrderPayment();
  const { showPayPal, initializePayment, resetPayment } = usePayPalPayment({
    onProcessing: () => {
      setIsFinalizingPayment(true);
    },
    onSuccess: async () => {
      try {
        onOrderSuccess?.();
        setIsFinalizingPayment(false);
        setShowSuccessModal(true);
        resetPayment();
      } catch (error) {
        toast.error("Order update error");
      } finally {
        setIsFinalizingPayment(false);
      }
    },
    onFailure: () => {
        setIsFinalizingPayment(false);
    }
  });

  const handlePaymentAndOrder = useCallback(async () => {
    if (!items.length || !shippingAddress) {
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
    initiateOrder,
    initializePayment,
    resetPayment,
  ]);

  const hasAddress = !!shippingAddress && shippingAddress.trim().length > 0;
  const isButtonDisabled =
    isProcessing ||
    !hasAddress ||
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
            formatPrice={formatPriceWithOptionalLocal}
          />

          <OrderTotals
            subtotal={totals.subtotal}
            discount={totals.discount}
            deliveryFee={totals.deliveryFee}
            // taxes={totals.taxes}
            // serviceCharge={totals.serviceCharge}
            total={totals.total}
            formatPrice={formatPriceWithOptionalLocal}
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
            formatPrice={formatPriceWithOptionalLocal}
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

      <ProcessingPaymentDialog open={isFinalizingPayment} />
    </Box>
  );
};