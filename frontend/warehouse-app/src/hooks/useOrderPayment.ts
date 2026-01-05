import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ecommerceService } from "@/services/ecommerce.service";
import { CartItem } from "@/types/ecommerce";

interface InitiateOrderData {
  shipping_address: string;
  currency?: string;
  product_ids: string[];
}

interface PayPalPaymentConfig {
  orderId: string;
  paypalOrderId: string;
  orderCurrency: string;
}

export const useOrderPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiateOrder = useCallback(
    async (
      items: CartItem[],
      shippingAddress: string,
    ): Promise<PayPalPaymentConfig | null> => {
      if (!items.length || !shippingAddress) {
        toast.error("No items to checkout.");
        return null;
      }

      setIsProcessing(true);

      try {
        const orderedProductIds = items
          .map((item) => item.product_id || item.product?.id)
          .filter((id): id is string => !!id);

        if (orderedProductIds.length === 0) {
          throw new Error("No valid product IDs found");
        }

        const orderData: InitiateOrderData = {
          shipping_address: shippingAddress,
          currency: "USD", 
          product_ids: orderedProductIds,
        };

        const initiateResponse = await ecommerceService.initiateOrder(orderData);
        const { orderId, paymentSessionId } = initiateResponse;

        if (!paymentSessionId) {
          throw new Error("Failed to initiate payment session");
        }

        return {
          orderId,
          paypalOrderId: paymentSessionId,
          orderCurrency: "USD",
        };
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to initiate checkout.";
        toast.error(errorMsg);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    isProcessing,
    initiateOrder,
  };
};

