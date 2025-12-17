export const PAYMENT_GATEWAY = { CASHFREE: 'cashfree' };

export const DEFAULT_CURRENCY_CODE = 'USD';

export const DEFAULT_CURRENCY_SYMBOL = '$';

export const DEFAULT_CURRENCY_RATE = 1;

export const DEFAULT_CURRENCY = {
  code: DEFAULT_CURRENCY_CODE,
  symbol: DEFAULT_CURRENCY_SYMBOL,
  rate: DEFAULT_CURRENCY_RATE,
} as const;

export const BASE_EXCHANGE_CURRENCY = DEFAULT_CURRENCY_CODE;

export const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  USD: '$',
  INR: '₹',
};

export const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/name';
export const EXCHANGE_RATE_URL = 'https://api.frankfurter.app/latest';
export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
export const CACHE_TTL_SECONDS = 25 * 60 * 60; // Slightly more than 24h
