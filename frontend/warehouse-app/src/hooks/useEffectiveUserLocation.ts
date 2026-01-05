"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getUserPreferences } from "@/lib/api.service";
import { getUserCountryByIP } from "@/utils/getUserCountry";
import { useEffect, useState } from "react";

export function useDetectUserLocation() {
  const { user } = useAuth();
  const [currencyCode, setCurrencyCode] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const isLoggedIn = !!user;

  const getCurrencyInfo = async () => {

    if (user?.id){
      const preferenceData = await getUserPreferences(user?.id);
      const userCurrency = preferenceData?.currency;
      const userCountry = preferenceData?.courier?.country?.code;
      setCountryCode(userCountry || "");
      setCurrencyCode(userCurrency?.currency_code || "");
    } else {
      //TODO P0: Fetch and store in localstorage and if in localstorage not found then fetch from the getUserCountryByIP API call
      const currencyInfo = await getUserCountryByIP();
      setCountryCode(currencyInfo.countryCode || "");
      setCurrencyCode(currencyInfo.currency || "");
    }
  };

  useEffect(() => {
    getCurrencyInfo();
  }, [isLoggedIn]);


  return {
    currencyCode,
    countryCode,
  };

}