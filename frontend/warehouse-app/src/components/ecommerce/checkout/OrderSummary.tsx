"use client";

import React, { useState } from "react";
import { Card, CardContent, Stack, Typography, Box, Divider, Button, CircularProgress } from "@mui/material";
import { Payment, DeliveryDining } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { launchCashfreePayment } from "@/services/cashfree-payment.service";
import { ecommerceService } from "@/services/ecommerce.service";
import { ROUTES } from "@/utils/constants";
import { getCartItemPricingSummary } from "@/utils/priceUtils";
import { CartItem } from "@/types/ecommerce";
import { CurrencyInfo } from "@/types/ecommerce";

interface OrderTotals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxes: number;
  serviceCharge: number;
  total: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  totals: OrderTotals;
  shippingAddress: string;
  selectedCurrency?: string;
  currencyInfo: CurrencyInfo;
  user: any;
  formatLocalPrice: (amount: number) => string;
  addressLoading: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  totals,
  shippingAddress,
  selectedCurrency,
  currencyInfo,
  user,
  formatLocalPrice,
  addressLoading,
}) => {
  const router = useRouter();
  const { removePurchasedProducts } = useCartStore();
  const { loading: authLoading } = useAuth();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePaymentAndOrder() {
    if (!items.length || !shippingAddress || authLoading) {
      toast.error("No items to checkout.");
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      const orderedProductIds = items
        .map((item) => item.product_id || item.product?.id)
        .filter((id): id is string => !!id);

      const orderData = {
        shipping_address: shippingAddress,
        currency: selectedCurrency,
        product_ids: orderedProductIds,
      }
      const initiateResponse = await ecommerceService.initiateOrder(orderData);
      const { orderId, orderNumber, paymentSessionId, totalAmount } = initiateResponse;

      if (!paymentSessionId) {
        throw new Error('Failed to initiate payment');
      }

      const paymentConfig = {
        orderId: orderNumber,
        orderAmount: totalAmount,
        orderCurrency: currencyInfo.code,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
        orderToken: paymentSessionId,
      };

      await launchCashfreePayment(
        paymentConfig,
        async (paymentResult: any) => {
          try {
            const purchasedIds = items.map((item) => item.product_id!);
            removePurchasedProducts(purchasedIds);
            await ecommerceService.updatePaymentStatus(orderId, paymentResult);
          } catch (error) {
            setError("Payment succeeded but order update failed. Contact support.");
            toast.error("Order update error");
          }
        },
        (failData: any) => {
          console.error("Payment Failed:", failData);
          toast.error(failData?.reason || "Payment cancelled");
          router.replace(ROUTES.CART);
        }
      )
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to initiate checkout.";
      setError(errorMsg);
      toast.error("Checkout initiation failed");
    } finally {
      setProcessing(false);
    }
  }

  const hasAddress = !!shippingAddress && shippingAddress.trim().length > 0;
  const isButtonDisabled =
    processing ||
    !hasAddress ||
    authLoading ||
    addressLoading ||
    items.length === 0;

  return (
    <Box>
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 3, 
          borderRadius: 3, 
          border: "1px solid #e9ecef",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
            <Payment sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Order Summary
            </Typography>
          </Stack>

          <Box sx={{ mb: 2, maxHeight: 300, overflow: "auto" }}>
            {items.map((item: CartItem) => {
              const pricing = getCartItemPricingSummary(item, currencyInfo);
              return (
                <Box
                  key={item.product_id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    py: 1.5,
                    borderBottom: "1px solid #f0f0f0",
                    "&:last-child": { borderBottom: "none" }
                  }}
                >
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5, color: "text.primary" }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Qty: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatLocalPrice(pricing.discountedUnitPrice)} each
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="primary.main"
                    sx={{ minWidth: 60, textAlign: "right" }}
                  >
                    {formatLocalPrice(pricing.lineTotal)}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" fontWeight={500} color="text.primary">Subtotal</Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                {formatLocalPrice(totals.subtotal)}
              </Typography>
            </Box>
            
            {totals.discount > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" color="success.main" fontWeight={500}>
                  Item Discounts
                </Typography>
                <Typography variant="body1" color="success.main" fontWeight={500}>
                  -{formatLocalPrice(totals.discount)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1" fontWeight={500} color="text.primary">Delivery</Typography>
              <Stack direction="row" alignItems="center" spacing={0.5} color={totals.deliveryFee === 0 ? "success.main" : "text.primary"}>
                <DeliveryDining sx={{ fontSize: 16 }} />
                <Typography variant="body2" fontWeight={600}>
                  {formatLocalPrice(totals.deliveryFee)}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" fontWeight={500} color="text.primary">Taxes (2%)</Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                {formatLocalPrice(totals.taxes)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" fontWeight={500} color="text.primary">Service Charge</Typography>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                {formatLocalPrice(totals.serviceCharge)}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" fontWeight={700} color="text.primary">Total</Typography>
              <Typography 
                variant="h5" 
                fontWeight={700} 
                color="primary.main"
                sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" } }}
              >
                {formatLocalPrice(totals.total)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<Payment />}
        onClick={handlePaymentAndOrder}
        disabled={isButtonDisabled}
        sx={{
          borderRadius: 3,
          py: 2,
          fontSize: "1.1rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.2s ease",
          bgcolor: "primary.main",
          "&:hover": { 
            bgcolor: "primary.dark",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            transform: "translateY(-1px)"
          },
          "&:disabled": {
            bgcolor: "grey.300",
            color: "grey.500",
            boxShadow: "none",
            transform: "none"
          }
        }}
      >
        {processing ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={24} color="inherit" />
            <Typography>Processing Payment...</Typography>
          </Box>
        ) : addressLoading ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={24} color="inherit" />
            <Typography>Fetching Address...</Typography>
          </Box>
        ) : (
          `Pay & Place Order • ${formatLocalPrice(totals.total)}`
        )}
      </Button>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          By placing your order, you agree to our Terms of Service
        </Typography>
      </Box>
    </Box>
  );
};