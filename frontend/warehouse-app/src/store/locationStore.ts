import { create } from "zustand";

import { getUserPreferences } from "@/lib/api.service";
import { ecommerceService } from "@/services/ecommerce.service";
import { LocationStore } from "./storeTypes";
import { getUserCountryByIP } from "@/utils/getUserCountry";
import { getCachedLocation, setCachedLocation } from "@/utils/cachedUtils";
import { CACHE_GUEST_LOCATION_KEY, DEFAULT_CURRENCY_INFO } from "@/utils/constants";

export const useLocationStore = create<LocationStore>((set, get) => {
  
  const loadLocation = async (userId?: string, skipCache = false) => {
    if (!skipCache && get().isLoaded) return;

    if (!userId) {
      if (!skipCache) {
        const cached = getCachedLocation(CACHE_GUEST_LOCATION_KEY);
        if (cached) {
          set({
            countryCode: cached.countryCode,
            currencyCode: cached.currencyInfo.code,
            currencySymbol: cached.currencyInfo.symbol,
            currencyRate: cached.currencyInfo.rate,
            isLoaded: true,
          });
          return;
        }
      }

      const location = await getUserCountryByIP();
      const countryCode = location.countryCode || "";
      const currencyCode = location.currency || "";

      let currencyInfo = DEFAULT_CURRENCY_INFO;

      if (currencyCode) {
        const currencyData = await ecommerceService
          .getCurrencyByCode(currencyCode)
          .catch(() => null);

        if (currencyData) {
          currencyInfo = {
            code: currencyData.currency_code ?? currencyCode,
            symbol: currencyData.currency_symbol ?? DEFAULT_CURRENCY_INFO.symbol,
            rate: Number(currencyData.rate) ?? DEFAULT_CURRENCY_INFO.rate,
          };
        }
      }

      setCachedLocation(CACHE_GUEST_LOCATION_KEY, {
        countryCode,
        currencyInfo,
      });

      set({
        countryCode,
        currencyCode: currencyInfo.code,
        currencySymbol: currencyInfo.symbol,
        currencyRate: currencyInfo.rate,
        isLoaded: true,
      });

      return;
    }

    const preferenceData = await getUserPreferences(userId);
    const userCurrency = preferenceData?.currency;

    set({
      countryCode: preferenceData?.courier?.country?.code || "",
      currencyCode: userCurrency?.currency_code || DEFAULT_CURRENCY_INFO.code,
      currencySymbol: userCurrency?.currency_symbol || DEFAULT_CURRENCY_INFO.symbol,
      currencyRate: userCurrency?.rate ?? DEFAULT_CURRENCY_INFO.rate,
      isLoaded: true,
    });
  };

  const fetchLocation = async (userId?: string) => {
    await loadLocation(userId, false);
  };

  const refreshLocation = async (userId?: string) => {
    set({ isLoaded: false });
    await loadLocation(userId, true);
  };

  return {
    currencyCode: "",
    currencySymbol: "",
    currencyRate: 0,
    countryCode: "",
    isLoaded: false,

    fetchLocation,
    refreshLocation,
  };
});
