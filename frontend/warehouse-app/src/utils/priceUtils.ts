export interface ParsedPrice {
  raw: number;
  formatted: string;
  currency: string;
}

export function parsePrice(priceInput: number | string, defaultCurrency = '₹'): ParsedPrice {
  let raw: number;
  let currency = defaultCurrency;

  if (typeof priceInput === 'string') {
    // Extract currency symbol
    const symbolMatch = priceInput.match(/[^\d\s.,-]/);
    currency = symbolMatch ? symbolMatch[0] : defaultCurrency;
    // Extract numeric part
    raw = parseFloat(priceInput.replace(/[^\d.]/g, '')) || 0;
  } else {
    raw = priceInput || 0;
  }

  const formatted = `${currency}${raw.toFixed(2)}`;

  return { raw, formatted, currency };
}

export function formatPrice(rawPrice: number, currency = '₹'): string {
  return `${currency}${rawPrice.toFixed(2)}`;
}

export function calculateDiscountedPrice(rawPrice: number, discountPercent: number): number {
  return rawPrice * (1 - (discountPercent / 100));
}