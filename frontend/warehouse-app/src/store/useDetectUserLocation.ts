"use client";

import { create } from "zustand";
import { DEFAULT_CURRENCY_INFO, DEFAULT_LOCATION, GUEST_LOCATION_STORAGE_KEY } from "@/utils/constants";
import { clearDataFromLocalStorage, getDataFromLocalStorage, setDataInLocalStorage } from "@/utils/localStorageUtils";
import { getUserPreferences } from "@/lib/api.service";
import { destructLocationData, destructUserPreferenceData } from "@/utils/preferences.utils";
import { fetchCurrencyAndCodeByIp } from "@/utils/getUserCountry";

export const useDetectUserLocation = create<any>((set, get) => {

  const fetchLocationBasedOnUser = async(userId?: string) => {
    const { isLoaded, isFetching } = get();

    if (isLoaded || isFetching) return;

    set({ isFetching: true });

    try {
      if (userId) {
        clearDataFromLocalStorage(GUEST_LOCATION_STORAGE_KEY)
        const preferenceData = await getUserPreferences(userId);
        const countryWithCurrencyDetails = destructUserPreferenceData(preferenceData);
        set({...countryWithCurrencyDetails, isLoaded: true});
      }
      else {
        const guestData = getDataFromLocalStorage(GUEST_LOCATION_STORAGE_KEY);
        if (guestData) {
          const countryWithCurrencyDetails = destructLocationData(guestData)
          set({...countryWithCurrencyDetails, isLoaded: true});
        }
        else {
          const {countryCode, countryName, currencyInfo} = await fetchCurrencyAndCodeByIp()
          setDataInLocalStorage(GUEST_LOCATION_STORAGE_KEY, {
            countryCode,
            countryName,
            currencyInfo,
          });

          set({
            countryCode,
            countryName,
            currencyCode: currencyInfo.code,
            currencySymbol: currencyInfo.symbol,
            currencyRate: currencyInfo.rate,
            isLoaded: true,
          });
        }
      }
    } finally {
      set({ isFetching: false });
    }
  };

  return {
    countryCode: DEFAULT_LOCATION.countryCode,
    countryName: DEFAULT_LOCATION.countryName,
    currencyCode: DEFAULT_CURRENCY_INFO.code,
    currencySymbol: DEFAULT_CURRENCY_INFO.symbol,
    currencyRate: DEFAULT_CURRENCY_INFO.rate,
    isLoaded: false,
    fetchLocationBasedOnUser,
  };
});