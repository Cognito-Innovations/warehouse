import { toast } from "sonner";
import { ecommerceService } from "./ecommerce.service";

function loadPayPalScript(currency: string) {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }
    const existingScript = document.querySelector("script[src*='paypal.com/sdk/js']");
    if (existingScript) {
      const checkLoaded = () => window.paypal ? resolve(window.paypal) : setTimeout(checkLoaded, 100);
      checkLoaded();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&components=buttons`;
    script.async = true;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject("PayPal SDK failed to load.");
    document.head.appendChild(script);
  });
}

export async function launchPayPalPayment(paymentConfig: { orderId: string; paypalOrderId: string; orderCurrency: string }, onSuccess: () => void, onFailure: (failData: any) => void) {
  try {
    await loadPayPalScript(paymentConfig.orderCurrency);
    if (!window.paypal) throw new Error("PayPal SDK not found!");

    const button = window.paypal.Buttons({
      createOrder: () => paymentConfig.paypalOrderId,
      onApprove: async (data: any) => {
        try {
          await ecommerceService.captureOrder(
            paymentConfig.orderId,
            data.orderID
          );
          toast.success("Payment completed successfully!");
          onSuccess();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Payment capture failed";
          toast.error(message);
          onFailure({ reason: message });
        }
      },
      onCancel: () => {
        toast.info("Payment cancelled");
        onFailure({ reason: "cancelled" });
      },
      onError: (error: any) => {
        console.error("PayPal error:", error);
        toast.error("Payment error occurred");
        onFailure({ reason: "error" });
      },
      // Disable credit/debit card buttons to show only PayPal
      disableFunding: 'card'
    });

    if (button.isEligible()) {
      button.render("#paypal-button-container");
    } else {
      throw new Error("PayPal buttons not eligible for this transaction");
    }
  } catch (err) {
    toast.error("Failed to load PayPal SDK");
    onFailure(err);
  }
}