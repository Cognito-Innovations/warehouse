"use client";

import { useEffect, useCallback, useMemo } from "react";
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
    skipInit: isLoggedIn,
  });

  const userAddress = useLocationStore((state) => state.userAddress);
  const isLoadingAddress = useLocationStore((state) => state.isLoadingAddress);
  const { fetchUserAddress, refreshUserAddress, initializeLocation, updateLocation } = useLocationStore();

  useEffect(() => {
    if (user?.id) {
      fetchUserAddress(user.id);
    } else {
      useLocationStore.getState().setUserAddress(null);
    }
  }, [user?.id, fetchUserAddress]);

  useEffect(() => {
    if (!isLoggedIn) {
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
    }
  }, [userAddress, isLoggedIn, defaults.city, defaults.pincode, initializeLocation, updateLocation]);

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
  const error = geoHook.error || useLocationStore((state) => state.error);

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