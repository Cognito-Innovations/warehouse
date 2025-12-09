import { toast } from "sonner";
import { CF_SCRIPT_SRC } from "@/utils/constants";

function loadCashfreeScript() {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }
    const existingScript = document.querySelector("script[src*='cashfree.js']");
    if (existingScript) {
      const checkLoaded = () => window.Cashfree ? resolve(window.Cashfree) : setTimeout(checkLoaded, 100);
      checkLoaded();
      return;
    }
    const script = document.createElement("script");
    script.src = CF_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => reject("Cashfree SDK failed to load.");
    document.head.appendChild(script);
  });
}

export async function launchCashfreePayment(paymentConfig: any, onSuccess: any, onFailure: any) {
  try {
    await loadCashfreeScript();
    if (!window.Cashfree) throw new Error("Cashfree SDK not found!");

    const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE;
    const cashfree = window.Cashfree({ mode });

    const options = {
      paymentSessionId: paymentConfig.orderToken,
      redirectTarget: "_self",
    }

    const paymentPromise = cashfree.checkout(options);

    paymentPromise
      .then((result: any) => {
        toast.success("Payment initiated");
        onSuccess(result);
      })
      .catch((error: any) => {
        toast.error(error.reason || "Payment failed");
        onFailure(error);
      });
  } catch (err) {
    toast.error("Failed to load payment SDK");
    if (onFailure) onFailure(err);
  }
}
