"use client";

import { useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserLocation } from "./useUserLocation";
import useLocationStore from "@/store/locationStore";
import { UserAddress } from "@/types/ecommerce";
import { CurrencyInfo } from "@/types/ecommerce";
import { EffectiveUserLocation } from "@/store/storeTypes";

export interface UseEffectiveUserLocationReturn {
  location: EffectiveUserLocation;
  currencyInfo: CurrencyInfo;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  hasValidAddress: boolean;
  address: UserAddress | null;
  refreshAddresses: () => Promise<void>;
  geoHook: ReturnType<typeof useUserLocation>;
}

export function useEffectiveUserLocation(
  defaults: { countryCode?: string; countryName?: string; city: string; pincode: string }
): UseEffectiveUserLocationReturn {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const geoHook = useUserLocation({
    defaultCity: defaults.city,
    defaultPincode: defaults.pincode,
    enableGeolocation: true,
    skipInit: false,
  });

  const userAddress = useLocationStore((state) => state.userAddress);
  const isLoadingAddress = useLocationStore((state) => state.isLoadingAddress);
  const isLoadingLocation = useLocationStore((state) => state.isLoadingLocation);
  const addressCache = useLocationStore((state) => state.addressCache); 
  const globalError = useLocationStore((state) => state.error);

  const fetchUserAddress = useLocationStore((state) => state.fetchUserAddress);
  const refreshUserAddress = useLocationStore((state) => state.refreshUserAddress);
  const initializeLocation = useLocationStore((state) => state.initializeLocation);
  const updateLocation = useLocationStore((state) => state.updateLocation);
  const setUserAddress = useLocationStore((state) => state.setUserAddress);

  const fetchInitiatedRef = useRef<string | null>(null);

  useEffect(() => {
    const userId = user?.id;

    if (userId) {
      if (fetchInitiatedRef.current !== userId) {
        fetchInitiatedRef.current = userId;
        fetchUserAddress(userId);
      }
    } else {
      fetchInitiatedRef.current = null;
      setUserAddress(null);
    }
  }, [user?.id, fetchUserAddress, setUserAddress]);

  useEffect(() => {
    if (isLoadingLocation) return;

    if (!isLoggedIn) {
       initializeLocation(defaults.city, defaults.pincode, true);
       return;
    }

    const hasCheckedCache = user?.id && addressCache[user?.id] !== undefined;

    if (isLoadingAddress || !hasCheckedCache) {
      return;
    }

    const hasValid = !!userAddress?.city && !!userAddress?.zip_code;
    const city = hasValid ? userAddress.city : defaults.city;
    const pincode = hasValid ? userAddress.zip_code : defaults.pincode;
    const countryName = userAddress?.country || defaults.countryName;
    const countryCode = defaults.countryCode || geoHook.location.countryCode;

    updateLocation({
      city,
      pincode,
      countryCode,
      countryName,
    });
  }, [
    userAddress, 
    isLoggedIn, 
    defaults.city, 
    defaults.pincode, 
    defaults.countryCode,
    defaults.countryName,
    initializeLocation, 
    updateLocation,
    isLoadingAddress,
    isLoadingLocation,
    addressCache,
    user?.id,
    geoHook.location.countryCode
  ]);

  const refreshAddresses = useCallback(async () => {
    if (user?.id) {
      await refreshUserAddress(user.id);
    }
  }, [user?.id, refreshUserAddress]);

  const hasValidAddress = isLoggedIn && !!userAddress && !!userAddress.city && !!userAddress.zip_code;

  const location: EffectiveUserLocation = useMemo(() => {
    if (hasValidAddress) {
      return {
        countryCode: geoHook.location.countryCode, 
        countryName: userAddress!.country,
        city: userAddress!.city,
        pincode: userAddress!.zip_code,
      };
    }
    return {
      countryCode: geoHook.location.countryCode,
      countryName: geoHook.location.countryName,
      city: geoHook.location.city,
      pincode: geoHook.location.pincode,
      currency: geoHook.location.currency,
    };
  }, [hasValidAddress, geoHook.location, userAddress]);

  const currencyInfo: CurrencyInfo = useMemo(() => {
    if (hasValidAddress && userAddress?.user?.preference?.currency?.currency_symbol) {
      const curr = userAddress.user.preference.currency;
      const code = curr.currency_code || 'INR';
      const rate = parseFloat(curr.rate || '1');
      return {
        symbol: curr.currency_symbol,
        code,
        rate,
        isBase: code === 'INR'
      };
    }
    const fallbackCode = location.currency || 'USD';
    const symbolMap: Record<string, string> = {
      'USD': '$',
      'INR': '₹',
    };
    const symbol = symbolMap[fallbackCode.toUpperCase()] || '$';
    return {
      symbol,
      code: fallbackCode.toUpperCase(),
      rate: 1,
      isBase: fallbackCode.toUpperCase() === 'USD'
    };
  }, [hasValidAddress, userAddress?.user?.preference?.currency, location.currency]);

  const isLoading = geoHook.isLoading || isLoadingAddress;
  const error = geoHook.error || globalError;

  return {
    location,
    currencyInfo,
    isLoading,
    error,
    isLoggedIn,
    hasValidAddress,
    address: userAddress,
    refreshAddresses,
    geoHook,
  };
}