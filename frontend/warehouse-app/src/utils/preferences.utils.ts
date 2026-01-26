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
    return {};
  }

export const destructUserPreferenceData = (data: any) => {
    const userCurrency = data?.currency?.currency_code;
    const resolvedCountryCode = data?.courier?.country?.code || data?.countryCode || "";
    return {
        countryCode: resolvedCountryCode,
        currencyCode: userCurrency?.currency_code,
        currencySymbol: userCurrency?.currency_symbol,
        currencyRate: userCurrency?.rate,
      }
  }