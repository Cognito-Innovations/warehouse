import { create } from "zustand";

import { getUserPreferences } from "@/lib/api.service";
import { ecommerceService } from "@/services/ecommerce.service";
import { LocationStore } from "./storeTypes";
import { fetchUserCountryByIP } from "@/utils/getUserCountry";
import { getDataFromLocalStorage, setDataInLocalStorage } from "@/utils/localStorageUtils";
import { GUEST_LOCATION_STORAGE_KEY, DEFAULT_CURRENCY_INFO, DEFAULT_LOCATION } from "@/utils/constants";

export const useLocationStore = create<LocationStore>((set, get) => {
  
  const loadLocation = async (userId?: string, skipCache = false) => {
    const state = get();
    if (!skipCache && state.isLoaded) return;

    if (!userId) {
      if (!skipCache) {
        const cached = getDataFromLocalStorage(GUEST_LOCATION_STORAGE_KEY);
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

      const location = await fetchUserCountryByIP();
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

      setDataInLocalStorage(GUEST_LOCATION_STORAGE_KEY, {
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

    if (userId) {
      try {
        const preferenceData = await getUserPreferences(userId);
        const userCurrency = preferenceData?.currency;

        const resolvedCountryCode = preferenceData?.courier?.country?.code || state.countryCode || "";
        
        set({
          countryCode: resolvedCountryCode,
          currencyCode: userCurrency?.currency_code,
          currencySymbol: userCurrency?.currency_symbol,
          currencyRate: userCurrency?.rate ?? DEFAULT_CURRENCY_INFO.rate,
          isLoaded: true,
        });
      } catch (error) {
        console.error("Error loading user location preferences", error);
        set({ isLoaded: true }); 
      }
    }
  };

  const refreshLocation = async (userId?: string) => {
    set({ isLoaded: false });
    await loadLocation(userId, true);
  };

  return {
    currencyCode: DEFAULT_CURRENCY_INFO.code,
    currencySymbol: DEFAULT_CURRENCY_INFO.symbol,
    currencyRate: DEFAULT_CURRENCY_INFO.rate,
    countryCode: DEFAULT_LOCATION.countryCode,
    isLoaded: false,

    refreshLocation,
    loadLocation,
  };
});
