import { toast } from "sonner";

const CF_SCRIPT_SRC = "https://sdk.cashfree.com/js/v3/cashfree.prod.js";

function loadCashfreeScript() {
  return new Promise((resolve, reject) => {
    if (window?.Cashfree) {
      resolve(window.Cashfree);
      return;
    }
    const existingScript = document.querySelector("script[src^='https://sdk.cashfree.com/js/v3/cashfree']");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.Cashfree));
      existingScript.addEventListener("error", () => reject("Cashfree SDK failed to load."));
      return;
    }
    const script = document.createElement("script");
    script.src = CF_SCRIPT_SRC.replace(".prod.js", ".test.js");
    script.async = true;
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => reject("Cashfree SDK failed to load.");
    document.body.appendChild(script);
  });
}

export async function launchCashfreePayment(paymentConfig, onSuccess, onFailure) {
  try {
    await loadCashfreeScript();
    if (!window.Cashfree) throw new Error("Cashfree SDK not found!");
    window.Cashfree.init({ mode: "sandbox" });
    window.Cashfree.startPayment({
      ...paymentConfig,
      onSuccess: (data) => {
        toast.success("Payment successful");
        if (onSuccess) onSuccess(data);
      },
      onFailure: (error) => {
        toast.error(error?.reason || "Payment failed");
        if (onFailure) onFailure(error);
      },
    });
  } catch (err) {
    toast.error("Failed to load payment SDK");
    if (onFailure) onFailure(err);
  }
}
