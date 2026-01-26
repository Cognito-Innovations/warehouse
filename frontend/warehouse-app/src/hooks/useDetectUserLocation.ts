"use client";

import { create } from "zustand";
import { GUEST_LOCATION_STORAGE_KEY } from "@/utils/constants";
import { getDataFromLocalStorage, setDataInLocalStorage } from "@/utils/localStorageUtils";
import { getUserPreferences } from "@/lib/api.service";
import { destructLocationData, destructUserPreferenceData } from "@/utils/preferences.utils";
import { fetchCurrencyAndCodeByIp } from "@/utils/getUserCountry";

export const useDetectUserLocation = create<any>((set) => {

  const fetchLocationBasedOnUser = async(userId?: string) => {
    if (userId) {
      const preferenceData = await getUserPreferences(userId);
      const countryWithCurrencyDetails = destructUserPreferenceData(preferenceData)
      set(countryWithCurrencyDetails);
    }
    else if (localStorage.getItem(GUEST_LOCATION_STORAGE_KEY)) {
      const data = getDataFromLocalStorage(GUEST_LOCATION_STORAGE_KEY);
      const countryWithCurrencyDetails = destructLocationData(data)
      set(countryWithCurrencyDetails);
    }
    else{
      const {countryCode, currencyInfo} = await fetchCurrencyAndCodeByIp()
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
    }
  }

  return {
    countryCode: "",
    currencyCode: "",
    currencySymbol: "",
    currencyRate: "",
    isLoaded: false,
    fetchLocationBasedOnUser,
  };
}); 