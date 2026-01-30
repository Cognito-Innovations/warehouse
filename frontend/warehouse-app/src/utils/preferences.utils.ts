import { DEFAULT_CURRENCY_INFO, DEFAULT_LOCATION } from "./constants";

export const destructLocationData = (data: any) => {
    const isValidData = data && data?.countryCode && data?.currencyInfo?.code && data?.currencyInfo?.symbol && data?.currencyInfo?.rate;
    if (isValidData) {
      return {
        countryCode: data.countryCode,
        currencyCode: data.currencyInfo.code,
        currencySymbol: data.currencyInfo.symbol,
        currencyRate: data.currencyInfo.rate,
      }
    }
    return {
      countryCode: DEFAULT_LOCATION.countryCode,
      currencyCode: DEFAULT_CURRENCY_INFO.code,
      currencySymbol: DEFAULT_CURRENCY_INFO.symbol,
      currencyRate: DEFAULT_CURRENCY_INFO.rate,
    };
  }

export const destructUserPreferenceData = (data: any) => {
    const userCurrency = data?.currency?.currency_code;
    const resolvedCountryCode = data?.courier?.country?.code || data?.countryCode || DEFAULT_LOCATION.countryCode;
    return {
        countryCode: resolvedCountryCode,
        currencyCode: userCurrency?.currency_code || DEFAULT_CURRENCY_INFO.code,
        currencySymbol: userCurrency?.currency_symbol || DEFAULT_CURRENCY_INFO.symbol,
        currencyRate: userCurrency?.rate || DEFAULT_CURRENCY_INFO.rate,
      }
  }