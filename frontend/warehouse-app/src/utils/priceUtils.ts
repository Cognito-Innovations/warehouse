import { CartItem, EcommerceProduct } from "@/types/ecommerce";

export interface PriceObject {
  price: number;
  currency: string;
}

export interface ParsedPrice {
  raw: number;
  formatted: string;
  currency: string;
}

export function parsePrice(priceInput: PriceObject | number | string, defaultCurrency = '$'): ParsedPrice {
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

export function formatPrice(rawPrice: number, currency = '$'): string {
  return `${currency}${rawPrice?.toFixed(2)}`;
}

export function calculateDiscountedPrice(rawPrice: number, discountPercent: number): number {
  return rawPrice * (1 - discountPercent / 100);
}

const roundCurrency = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export interface ProductPricingSummary {
  currency: string;
  originalUnitPrice: number;
  discountedUnitPrice: number;
  discountPercent: number;
  discountPerUnit: number;
}

export const getProductPricingSummary = (
  product: Pick<EcommerceProduct, "price" | "discount_percentage">
): ProductPricingSummary => {
  const parsed = parsePrice(product.price);
  const discountPercent = Number(product.discount_percentage) || 0;
  const discountedUnitPrice = roundCurrency(calculateDiscountedPrice(parsed.raw, discountPercent));
  const discountPerUnit = roundCurrency(parsed.raw - discountedUnitPrice);

  return {
    currency: parsed.currency,
    originalUnitPrice: roundCurrency(parsed.raw),
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

export const getCartItemPricingSummary = (item: CartItem): CartItemPricingSummary => {
  const productPricing = getProductPricingSummary(item.product);

  if (productPricing.originalUnitPrice === 0 && item.unit_price) {
    const parsedUnit = parsePrice(item.unit_price, productPricing.currency);
    productPricing.discountedUnitPrice = roundCurrency(parsedUnit.raw);
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