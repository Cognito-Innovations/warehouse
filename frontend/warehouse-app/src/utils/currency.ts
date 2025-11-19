// Currency mapping by country with exchange rates (base: INR = 1)
// Exchange rates are approximate and should be updated from a live API in production
export const countryCurrencyMap: Record<string, { code: string; symbol: string; locale: string; exchangeRate: number }> = {
  India: { code: "INR", symbol: "₹", locale: "en-IN", exchangeRate: 1 },
  "United States": { code: "USD", symbol: "$", locale: "en-US", exchangeRate: 0.012 }, // 1 INR = 0.012 USD
  "United Kingdom": { code: "GBP", symbol: "£", locale: "en-GB", exchangeRate: 0.0095 }, // 1 INR = 0.0095 GBP
  Singapore: { code: "SGD", symbol: "S$", locale: "en-SG", exchangeRate: 0.016 }, // 1 INR = 0.016 SGD
  Canada: { code: "CAD", symbol: "C$", locale: "en-CA", exchangeRate: 0.016 }, // 1 INR = 0.016 CAD
  Australia: { code: "AUD", symbol: "A$", locale: "en-AU", exchangeRate: 0.018 }, // 1 INR = 0.018 AUD
  Japan: { code: "JPY", symbol: "¥", locale: "ja-JP", exchangeRate: 1.8 }, // 1 INR = 1.8 JPY
  China: { code: "CNY", symbol: "¥", locale: "zh-CN", exchangeRate: 0.087 }, // 1 INR = 0.087 CNY
  Germany: { code: "EUR", symbol: "€", locale: "de-DE", exchangeRate: 0.011 }, // 1 INR = 0.011 EUR
  France: { code: "EUR", symbol: "€", locale: "fr-FR", exchangeRate: 0.011 },
  Italy: { code: "EUR", symbol: "€", locale: "it-IT", exchangeRate: 0.011 },
  Spain: { code: "EUR", symbol: "€", locale: "es-ES", exchangeRate: 0.011 },
  "United Arab Emirates": { code: "AED", symbol: "د.إ", locale: "ar-AE", exchangeRate: 0.044 }, // 1 INR = 0.044 AED
  UAE: { code: "AED", symbol: "د.إ", locale: "ar-AE", exchangeRate: 0.044 },
  Dubai: { code: "AED", symbol: "د.إ", locale: "ar-AE", exchangeRate: 0.044 },
  Thailand: { code: "THB", symbol: "฿", locale: "th-TH", exchangeRate: 0.43 }, // 1 INR = 0.43 THB
  Malaysia: { code: "MYR", symbol: "RM", locale: "ms-MY", exchangeRate: 0.056 }, // 1 INR = 0.056 MYR
  Indonesia: { code: "IDR", symbol: "Rp", locale: "id-ID", exchangeRate: 190 }, // 1 INR = 190 IDR
  Philippines: { code: "PHP", symbol: "₱", locale: "en-PH", exchangeRate: 0.67 }, // 1 INR = 0.67 PHP
  Vietnam: { code: "VND", symbol: "₫", locale: "vi-VN", exchangeRate: 300 }, // 1 INR = 300 VND
  "South Korea": { code: "KRW", symbol: "₩", locale: "ko-KR", exchangeRate: 16 }, // 1 INR = 16 KRW
  Taiwan: { code: "TWD", symbol: "NT$", locale: "zh-TW", exchangeRate: 0.38 }, // 1 INR = 0.38 TWD
  "Hong Kong": { code: "HKD", symbol: "HK$", locale: "zh-HK", exchangeRate: 0.094 }, // 1 INR = 0.094 HKD
};

export const getCurrencyForCountry = (country: string) => {
  return countryCurrencyMap[country] || countryCurrencyMap["India"]; // Default to INR
};

// Convert amount from INR to target currency
export const convertCurrency = (amountInINR: number, targetCountry: string): number => {
  // Ensure amountInINR is a valid number
  const validAmount = Number(amountInINR) || 0;
  if (isNaN(validAmount)) return 0;
  
  const currency = getCurrencyForCountry(targetCountry);
  const converted = validAmount * currency.exchangeRate;
  
  // Return 0 if conversion results in NaN
  return isNaN(converted) ? 0 : converted;
};

// Format currency with proper symbol and converted amount
export const formatCurrency = (amountInINR: number, country: string): string => {
  const currency = getCurrencyForCountry(country);
  const convertedAmount = convertCurrency(amountInINR, country);
  
  // For currencies with high exchange rates (like JPY, IDR, VND), show fewer decimals
  if (currency.exchangeRate > 10) {
    return `${currency.symbol}${Math.round(convertedAmount)}`;
  }
  // For most currencies, show 2 decimal places
  if (currency.exchangeRate < 1) {
    return `${currency.symbol}${convertedAmount.toFixed(2)}`;
  }
  // For currencies like THB, show 2 decimal places
  return `${currency.symbol}${convertedAmount.toFixed(2)}`;
};

// Get user's country from browser or localStorage
export const getUserCountry = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  // Check localStorage first (for testing)
  const savedCountry = localStorage.getItem("selectedCountry");
  if (savedCountry) return savedCountry;

  // Try to detect from browser
  try {
    const locale = navigator.language || "en-IN";
    if (locale.includes("en-US")) return "United States";
    if (locale.includes("en-GB")) return "United Kingdom";
    if (locale.includes("en-SG")) return "Singapore";
    if (locale.includes("en-IN") || locale.includes("hi")) return "India";
  } catch (err) {
  }
  return undefined;
};

export const setUserCountry = (country: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("selectedCountry", country);
  }
};

