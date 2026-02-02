export const formatDateTime = (timestamp?: string | number) => {
  if (!timestamp) return "";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Formats discount percentage for display
 * @param percentage - The discount percentage value (can be number or string)
 * @param suffix - Optional suffix to append (e.g., "OFF", "off", "% off")
 * @returns Formatted string like "10%", "10% OFF", "10% off", etc.
 */
export const formatDiscountPercentage = (percentage: number | string, suffix?: string): string => {
  const parsedPercentage = parseFloat(String(percentage));
  if (isNaN(parsedPercentage)) return "0%";
  
  // Remove trailing zeros and decimal point if not needed
  const formattedPercentage = parsedPercentage.toString().replace(/\.0+$/, "");
  const baseFormat = `${formattedPercentage}%`;
  
  return suffix ? `${baseFormat} ${suffix}` : baseFormat;
};

import { CartItem } from "@/types/ecommerce";

export function normalizeCart(cart: unknown): CartItem[] {
  return Array.isArray(cart) ? cart : [];
}
