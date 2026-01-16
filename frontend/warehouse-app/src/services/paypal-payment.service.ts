import { toast } from "sonner";
import { ecommerceService } from "./ecommerce.service";

interface PayPalConfig {
  orderId: string;
  paypalOrderId: string;
  orderCurrency: string;
}

const PAYPAL_SDK_URL = "https://www.paypal.com/sdk/js";
const SANDBOX_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

if (!SANDBOX_CLIENT_ID) {
  console.warn("PayPal Client ID not configured. PayPal payments will not work.");
}

function loadPayPalScript(currency: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if PayPal SDK is already loaded
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector("script[src*='paypal.com/sdk/js']");
    if (existingScript) {
      const checkLoaded = () => {
        if (window.paypal) {
          resolve(window.paypal);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = `${PAYPAL_SDK_URL}?client-id=${SANDBOX_CLIENT_ID}&currency=${currency}&components=buttons,card-fields`;
    script.async = true;
    script.setAttribute("data-sdk-integration-source", "button-factory");

    script.onload = () => {
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error("PayPal SDK loaded but window.paypal is not available"));
      }
    };

    script.onerror = () => {
      reject(new Error("PayPal SDK failed to load. Please check your internet connection and try again."));
    };

    document.head.appendChild(script);
  });
}

export async function launchPayPalPayment(
  paymentConfig: PayPalConfig,
  onProcessing: () => void,
  onSuccess: () => void,
  onFailure: (failData: any) => void
): Promise<any> {
  try {
    if (!SANDBOX_CLIENT_ID) {
      throw new Error("PayPal Client ID is not configured");
    }

    // Load PayPal SDK
    await loadPayPalScript(paymentConfig.orderCurrency);
    
    if (!window.paypal) {
      throw new Error("PayPal SDK not found after loading");
    }

    if (!window.paypal.Buttons) {
      throw new Error("PayPal Buttons API not available");
    }

    // Clear any existing buttons
    const container = document.getElementById("paypal-button-container");
    if (container) {
      container.innerHTML = "";
    }

    // Create PayPal buttons
    const button = window.paypal.Buttons({
      createOrder: () => Promise.resolve(paymentConfig.paypalOrderId),
      onApprove: async (data: { orderID: string }) => {
        try {
          onProcessing(); 
          await ecommerceService.captureOrder(paymentConfig.orderId, data.orderID);
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
        let errorMessage = error?.message || "Payment error occurred";
        
        // Provide helpful error messages for common issues
        if (errorMessage.includes("card") || errorMessage.includes("add this card")) {
          errorMessage = "Card payment failed. Please ensure you're using a valid PayPal sandbox test card. For sandbox testing, use test card numbers from PayPal Developer Dashboard.";
        }
        
        toast.error(errorMessage);
        onFailure({ reason: errorMessage });
      },
      style: {
        layout: "vertical",
        color: "black",
        shape: "rect",
        label: "pay",
        height: 50,
      },
    });

    if (!button.isEligible()) {
      throw new Error("PayPal buttons are not eligible for this transaction");
    }

    // Render buttons
    if (container) {
      button.render("#paypal-button-container");
      return button;
    } else {
      throw new Error("PayPal button container not found");
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to load PayPal SDK";
    console.error("PayPal initialization error:", err);
    toast.error(errorMessage);
    onFailure({ reason: errorMessage });
    throw err;
  }
}
