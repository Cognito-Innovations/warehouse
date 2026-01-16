import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { launchPayPalPayment } from "@/services/paypal-payment.service";
import { ROUTES } from "@/utils/constants";

interface PayPalConfig {
  orderId: string;
  paypalOrderId: string;
  orderCurrency: string;
}

interface UsePayPalPaymentOptions {
  onProcessing?: () => void;
  onSuccess?: () => void;
  onFailure?: (reason: string) => void;
}

export const usePayPalPayment = ({ onProcessing, onSuccess, onFailure }: UsePayPalPaymentOptions = {}) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState<PayPalConfig | null>(null);
  const isMountedRef = useRef(true);
  const buttonInstanceRef = useRef<any>(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Handle visibility change to prevent refresh on tab switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && showPayPal && paypalConfig) {
        // Re-render PayPal buttons if they exist when tab becomes visible
        const container = document.getElementById("paypal-button-container");
        if (container && container.children.length === 0 && buttonInstanceRef.current) {
          // Buttons should persist, but if they're gone, we'll handle it
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [showPayPal, paypalConfig]);

  const handleProcessing = useCallback(() => {
    if (!isMountedRef.current) return;
    onProcessing?.();
  }, [onProcessing]);

  const handleSuccess = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      setShowPayPal(false);
      setPaypalConfig(null);
      onSuccess?.();
    } catch (error) {
      console.error("Success handler error:", error);
      toast.error("Order update error");
    }
  }, [onSuccess]);

  const handleFailure = useCallback((reason: string) => {
    if (!isMountedRef.current) return;
    console.error("Payment Failed:", reason);
    if (reason !== "cancelled") {
      toast.error(reason || "Payment cancelled");
    }
    setShowPayPal(false);
    setPaypalConfig(null);
    if (reason !== "cancelled") {
      router.replace(ROUTES.CART);
    }
    onFailure?.(reason);
  }, [onFailure, router]);

  useEffect(() => {
    if (!showPayPal || !paypalConfig) return;

    let isCancelled = false;

    // Clear any existing buttons before rendering new ones
    const container = document.getElementById("paypal-button-container");
    if (container) {
      container.innerHTML = "";
    }

    launchPayPalPayment(
      paypalConfig,
      () => {
        if (!isCancelled && isMountedRef.current) {
          handleProcessing();
        }
      },
      () => {
        if (!isCancelled && isMountedRef.current) {
          handleSuccess();
        }
      },
      (failData: any) => {
        if (!isCancelled && isMountedRef.current) {
          handleFailure(failData?.reason || "Payment failed");
        }
      }
    ).then((buttonInstance) => {
      if (buttonInstance && !isCancelled) {
        buttonInstanceRef.current = buttonInstance;
      }
    }).catch((err) => {
      if (!isCancelled && isMountedRef.current) {
        console.error("PayPal launch error:", err);
        toast.error("Failed to initialize PayPal");
        setShowPayPal(false);
        setPaypalConfig(null);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [showPayPal, paypalConfig, handleProcessing, handleSuccess, handleFailure]);

  const initializePayment = useCallback((config: PayPalConfig) => {
    if (!isMountedRef.current) return;
    setPaypalConfig(config);
    setShowPayPal(true);
  }, []);

  const resetPayment = useCallback(() => {
    if (!isMountedRef.current) return;
    setShowPayPal(false);
    setPaypalConfig(null);
  }, []);

  return {
    isProcessing,
    setIsProcessing,
    showPayPal,
    initializePayment,
    resetPayment,
  };
};

