import { CartItem, EcommerceProduct } from "@/types/ecommerce";
import { CurrencyInfo } from "@/types/ecommerce";

export interface PriceObject {
  price: number;
  currency: string;
}

export interface ParsedPrice {
  raw: number;
  formatted: string;
  currency: string;
}

export function parsePrice(priceInput: PriceObject | number | string, defaultCurrency = 'INR'): ParsedPrice {
  let raw: number;
  let currency = defaultCurrency;

  if (typeof priceInput === 'object' && 'price' in priceInput && 'currency' in priceInput) {
    raw = priceInput.price || 0;
    currency = priceInput.currency || defaultCurrency;
  } else if (typeof priceInput === 'string') {
    const symbolMatch = priceInput.match(/[^\d\s.,-]/);
    currency = symbolMatch ? symbolMatch[0] : defaultCurrency;
    raw = parseFloat(priceInput.replace(/[^\d.]/g, '')) || 0;
  } else {
    raw = priceInput || 0;
  }

  const formatted = `${currency}${raw.toFixed(2)}`;

  return { raw, formatted, currency };
}

export function formatPrice(rawPrice: number, currency_symbol = 'INR'): string {
  return `${currency_symbol}${rawPrice?.toFixed(2)}`;
}

export function calculateDiscountedPrice(rawPrice: number, discountPercent: number): number {
  return rawPrice * (1 - discountPercent / 100);
}

export const roundCurrency = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export interface ProductPricingSummary {
  currency: string;
  originalUnitPrice: number;
  discountedUnitPrice: number;
  discountPercent: number;
  discountPerUnit: number;
}

export const getProductPricingSummary = (
  product: Pick<EcommerceProduct, "price" | "discount_percentage">,
  currencyInfo?: CurrencyInfo
): ProductPricingSummary => {
  const parsed = parsePrice(product.price);
  let raw = parsed.raw;
  let currency = parsed.currency;

  if (currencyInfo) {
    raw = roundCurrency(raw * currencyInfo.rate);
    currency = currencyInfo.symbol;
  } else if (currencyInfo) {
    currency = currencyInfo.symbol;
  }

  const discountPercent = Number(product.discount_percentage) || 0;
  const discountedUnitPrice = roundCurrency(calculateDiscountedPrice(raw, discountPercent));
  const discountPerUnit = roundCurrency(raw - discountedUnitPrice);

  return {
    currency,
    originalUnitPrice: roundCurrency(raw),
    discountedUnitPrice,
    discountPercent,
    discountPerUnit,
  };
};

export interface CartItemPricingSummary extends ProductPricingSummary {
  quantity: number;
  lineTotal: number;
  discountTotal: number;
}

export const getCartItemPricingSummary = (
  item: CartItem,
  currencyInfo?: CurrencyInfo
): CartItemPricingSummary => {
  const unitPrice = roundCurrency(Number(item.unit_price) || 0);
  const quantity = item.quantity || 0;
  const discountAmount = roundCurrency(Number(item.discount_amount) || 0);

  const originalUnitPrice =
    discountAmount > 0
      ? roundCurrency(unitPrice + discountAmount)
      : unitPrice;

  const discountPerUnit = roundCurrency(originalUnitPrice - unitPrice);

  return {
    currency: currencyInfo?.symbol ?? 'INR',
    originalUnitPrice,
    discountedUnitPrice: unitPrice,
    discountPercent:
      originalUnitPrice > 0
        ? roundCurrency((discountPerUnit / originalUnitPrice) * 100)
        : 0,
    discountPerUnit,
    quantity,
    lineTotal: roundCurrency(unitPrice * quantity),
    discountTotal: roundCurrency(discountPerUnit * quantity),
  };
};

export function getUSDFromLocal(localAmount: number, currencyInfo: CurrencyInfo): number {
  if (!currencyInfo.rate) {
    if (currencyInfo.code === 'INR') {
      return roundCurrency(localAmount / 90.25);
    }
    return roundCurrency(localAmount);
  }
  return roundCurrency(localAmount / currencyInfo.rate);
}