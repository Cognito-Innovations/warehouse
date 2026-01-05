"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPreferences } from "@/lib/api.service";
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

    setCountryCode(countryCode);
    setCurrencyInfo(DEFAULT_CURRENCY_INFO);

    setCachedLocation(CACHE_GUEST_LOCATION_KEY, {
      countryCode,
      currencyInfo: DEFAULT_CURRENCY_INFO,
    });
  };

  const handleUserLocation = async (userId: string) => {
    const preferenceData = await getUserPreferences(userId);
    const userCurrency = preferenceData?.currency;

    setCountryCode(preferenceData?.courier?.country?.code || "");
    setCurrencyInfo({
      code: userCurrency?.currency_code || "",
      symbol: userCurrency?.currency_symbol || "",
      rate: userCurrency?.rate || 0,
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

  // TODO P0: Destructure values {currencyCode, rate, symbol, countryCode}
  return { currencyInfo, countryCode };
}