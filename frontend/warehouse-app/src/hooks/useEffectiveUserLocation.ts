"use client";

import { useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserLocation } from "./useUserLocation";
import useLocationStore from "@/store/locationStore";
import { UserAddress } from "@/types/ecommerce";

export interface EffectiveUserLocation {
  countryCode?: string;
  countryName?: string;
  city?: string;
  pincode?: string;
}

export interface UseEffectiveUserLocationReturn {
  location: EffectiveUserLocation;
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
    skipInit: true,
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

    const hasCheckedCache = user?.id && addressCache[user.id] !== undefined;

    if (isLoadingAddress || (user?.id && !hasCheckedCache)) {
      return;
    }

    if (userAddress) {
      const hasValid = !!userAddress.city && !!userAddress.zip_code;
      if (hasValid) {
        updateLocation({
          city: userAddress.city,
          pincode: userAddress.zip_code,
          countryCode: undefined,
          countryName: userAddress.country,
        });
      } else {
        initializeLocation(defaults.city, defaults.pincode, true);
      }
    } else {
      initializeLocation(defaults.city, defaults.pincode, true);
    }
  }, [
    userAddress, 
    isLoggedIn, 
    defaults.city, 
    defaults.pincode, 
    initializeLocation, 
    updateLocation,
    isLoadingAddress,
    isLoadingLocation,
    addressCache,
    user?.id
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
    };
  }, [hasValidAddress, geoHook.location, userAddress]);

  const isLoading = geoHook.isLoading || isLoadingAddress;
  const error = geoHook.error || globalError;

  return {
    location,
    isLoading,
    error,
    isLoggedIn,
    hasValidAddress,
    address: userAddress,
    refreshAddresses,
    geoHook,
  };
}