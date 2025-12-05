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

export function formatPrice(rawPrice: number, currency = 'INR'): string {
  return `${currency}${rawPrice?.toFixed(2)}`;
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

  if (currencyInfo && !currencyInfo.isBase) {
    raw = roundCurrency(raw / currencyInfo.rate);
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
  const productPricing = getProductPricingSummary(item.product, currencyInfo);

  if (productPricing.originalUnitPrice === 0 && item.unit_price) {
    let unitRaw = parsePrice(item.unit_price, 'INR').raw;
    if (currencyInfo && !currencyInfo.isBase) {
      unitRaw = roundCurrency(unitRaw / currencyInfo.rate);
    }
    productPricing.discountedUnitPrice = roundCurrency(unitRaw);
    productPricing.originalUnitPrice =
      productPricing.discountPercent > 0
        ? roundCurrency(productPricing.discountedUnitPrice / (1 - productPricing.discountPercent / 100))
        : productPricing.discountedUnitPrice;
    productPricing.discountPerUnit = roundCurrency(
      productPricing.originalUnitPrice - productPricing.discountedUnitPrice
    );
  }

  const quantity = item.quantity || 0;
  const lineTotal = roundCurrency(productPricing.discountedUnitPrice * quantity);
  const discountTotal = roundCurrency(productPricing.discountPerUnit * quantity);

  return {
    ...productPricing,
    quantity,
    lineTotal,
    discountTotal,
  };
};