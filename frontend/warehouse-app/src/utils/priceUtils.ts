import { CartItem, EcommerceProduct } from "@/types/ecommerce";
import { DEFAULT_CURRENCY_INFO, INR_CURRENCY } from "./constants";

export interface PriceObject {
  price: number;
  currency: string;
}

export interface ParsedPrice {
  raw: number;
  formatted: string;
  currency: string;
}

export function parsePrice(
  priceInput: PriceObject | number | string,
  defaultCurrency = INR_CURRENCY.code
): ParsedPrice {
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

export function formatPrice(rawPrice: number, currency_symbol = DEFAULT_CURRENCY_INFO.symbol): string {
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
  currencyRate: number,
  currencySymbol: string,
): ProductPricingSummary => {
  const parsed = parsePrice(product.price);
  let raw = parsed.raw;
  let currency = parsed.currency;

  if (currencyRate && currencySymbol) {
    raw = roundCurrency(raw * currencyRate);
    currency = currencySymbol;
  } else if (currencySymbol) {
    currency = currencySymbol;
  }

  const discountPercent = Number(product.discount_percentage) || 0;
  const discountedUnitPrice = roundCurrency(
    calculateDiscountedPrice(raw, discountPercent)
  );
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
  currencySymbol?: string,
): CartItemPricingSummary => {
  const quantity = Number(item.quantity) || 0;

  const catalogPrice = roundCurrency(
    Number((item as any)?.product?.price?.price) || 
    Number((item as any)?.product?.price) || 
    0
  );

  const sellingPrice = roundCurrency(Number(item.unit_price) || 0);

  const productDiscountPercent = Number((item as any)?.product?.discount_percentage) || 0;

  let originalUnitPrice = catalogPrice > 0 ? catalogPrice : sellingPrice;
  let discountedUnitPrice = sellingPrice > 0 ? sellingPrice : originalUnitPrice;

  if (originalUnitPrice === discountedUnitPrice && productDiscountPercent > 0) {
    discountedUnitPrice = roundCurrency(
      calculateDiscountedPrice(originalUnitPrice, productDiscountPercent)
    );
  }

  const discountPerUnit = roundCurrency(Math.max(originalUnitPrice - discountedUnitPrice, 0));

  const discountPercent =
    originalUnitPrice > 0
      ? roundCurrency((discountPerUnit / originalUnitPrice) * 100)
      : 0;

  return {
    currency: currencySymbol ?? INR_CURRENCY.symbol,
    originalUnitPrice,
    discountedUnitPrice,
    discountPercent,
    discountPerUnit,
    quantity,
    lineTotal: roundCurrency(discountedUnitPrice * quantity),
    discountTotal: roundCurrency(discountPerUnit * quantity),
  };
};

export function convertToUSD(
  amount: number,
  currencyCode: string,
  currencyRate: number,
): number {
  if (!currencyRate) {
    if (currencyCode === INR_CURRENCY.code) {
      return roundCurrency(amount / INR_CURRENCY.rate);
    }
    return roundCurrency(amount);
  }
  return roundCurrency(amount / currencyRate);
}