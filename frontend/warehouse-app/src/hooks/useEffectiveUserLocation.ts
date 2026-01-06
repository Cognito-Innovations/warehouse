"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPreferences } from "@/lib/api.service";
import { ecommerceService } from "@/services/ecommerce.service";
import { getCachedLocation, setCachedLocation } from "@/utils/cachedUtils";
import { CACHE_GUEST_LOCATION_KEY, DEFAULT_CURRENCY_INFO } from "@/utils/constants";
import { getUserCountryByIP } from "@/utils/getUserCountry";

export function useDetectUserLocation() {
  const { user } = useAuth();
  
  const [currencyInfo, setCurrencyInfo] = useState({
    code: "",
    symbol: "",
    rate: 0,
  });
  const [countryCode, setCountryCode] = useState("");
  const userId = user?.id;

  const hasFetchedRef = useRef(false);

  const handleGuestLocation = async () => {
    const cachedLocation = getCachedLocation(CACHE_GUEST_LOCATION_KEY);
    if (cachedLocation) {
      setCountryCode(cachedLocation.countryCode || "");
      setCurrencyInfo(cachedLocation.currencyInfo);
      return;
    }

    const location = await getUserCountryByIP();
    const countryCode = location.countryCode || "";
    const currencyCode = location.currency || "";

    let currencyInfo = { ...DEFAULT_CURRENCY_INFO };

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

    setCountryCode(countryCode);
    setCurrencyInfo(currencyInfo);

    setCachedLocation(CACHE_GUEST_LOCATION_KEY, {
      countryCode,
      currencyInfo,
    });
  };

  const handleUserLocation = async (userId: string) => {
    const preferenceData = await getUserPreferences(userId);
    const userCurrency = preferenceData?.currency;

    setCountryCode(preferenceData?.courier?.country?.code || "");
    setCurrencyInfo({
      code: userCurrency?.currency_code || DEFAULT_CURRENCY_INFO.code,
      symbol: userCurrency?.currency_symbol || DEFAULT_CURRENCY_INFO.symbol,
      rate: userCurrency?.rate ?? DEFAULT_CURRENCY_INFO.rate,
    });
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;

    if (!userId) {
      handleGuestLocation();
    } else {
      handleUserLocation(userId);
    }
  }, [userId]);

  return { 
    currencyCode: currencyInfo.code,
    currencySymbol: currencyInfo.symbol,
    currencyRate: currencyInfo.rate,
    countryCode,
  };
}