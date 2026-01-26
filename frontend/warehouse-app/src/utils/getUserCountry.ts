import { ecommerceService } from "@/services/ecommerce.service";
import { DEFAULT_CURRENCY_INFO, DEFAULT_LOCATION } from "./constants";

interface UserCountry {
  countryCode: string;
  countryName: string;
  currency: string;
}

interface CurrencyInfoProps {
  code: string;
  symbol: string;
  rate: number;
}

export async function fetchUserCountryByIP(): Promise<UserCountry> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) {
      throw new Error('Failed to get user country by IP');
    }
    const data = await res.json();
    return {
      countryName: data.country_name,
      currency: data.currency,
      countryCode: data.country_code
    };
  } catch (error) {
      console.log('Error occured fetchUserCountryByIP', error)
      return {
        currency: DEFAULT_CURRENCY_INFO.code,
        countryCode: DEFAULT_LOCATION.countryCode,
        countryName: DEFAULT_LOCATION.countryName
      }
  }
}

export async function fetchCurrencyByCode(currencyCode: string): Promise<any> {
  try {
    const currencyData = await ecommerceService
    .getCurrencyByCode(currencyCode)
    .catch(() => null);

    return {
      code: currencyData.currency_code ?? currencyCode,
      symbol: currencyData.currency_symbol ?? DEFAULT_CURRENCY_INFO.symbol,
      rate: Number(currencyData.rate) ?? DEFAULT_CURRENCY_INFO.rate,
    };

  } catch (e) {
    return {
      code: DEFAULT_CURRENCY_INFO.code,
      symbol: DEFAULT_CURRENCY_INFO.symbol,
      rate: DEFAULT_CURRENCY_INFO.rate,
    };
  }
}

export async function fetchCurrencyAndCodeByIp(): Promise<{currencyInfo: CurrencyInfoProps, countryCode: string}> {
  try {
    const data = await fetchUserCountryByIP()
    const countryCode = data.countryCode as string;
    const currencyCode = data.currency;  //INR, USD, GBP, etc.
    const currencyInfo = await fetchCurrencyByCode(currencyCode as string);
    return {countryCode, currencyInfo}
  } catch (e) {
    const currencyInfo: CurrencyInfoProps = {
      code: DEFAULT_CURRENCY_INFO.code,
      symbol: DEFAULT_CURRENCY_INFO.symbol,
      rate: DEFAULT_CURRENCY_INFO.rate,
    };
    return {
      countryCode: DEFAULT_LOCATION.countryCode,
      currencyInfo,
    };
  }
}