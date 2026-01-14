import { DEFAULT_CURRENCY_INFO, DEFAULT_LOCATION } from "./constants";

interface UserCountry {
  countryCode?: string;
  countryName?: string;
  currency?: string;
}

export async function getUserCountryByIP(): Promise<UserCountry> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        countryCode: DEFAULT_LOCATION.countryCode,
        countryName: DEFAULT_LOCATION.countryName,
        currency: DEFAULT_CURRENCY_INFO.code
      };
    }
    const data = await res.json();
    return {
      countryCode: data.country_code,
      countryName: data.country_name,
      currency: data.currency
    };
  } catch (e) {
    return {
      countryCode: DEFAULT_LOCATION.countryCode,
      countryName: DEFAULT_LOCATION.countryName,
      currency: DEFAULT_CURRENCY_INFO.code
    };
  }
}