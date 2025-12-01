"use client";

import { useEffect } from "react";
import useLocationStore from "@/store/locationStore";

interface UseUserLocationOptions {
  defaultCity: string;
  defaultPincode: string;
  enableGeolocation?: boolean;
  skipInit?: boolean;
}

export function useUserLocation({
  defaultCity,
  defaultPincode,
  enableGeolocation = true,
  skipInit = false,
}: UseUserLocationOptions) {
  const userLocation = useLocationStore((state) => state.userLocation);
  const isLoading = useLocationStore((state) => state.isLoadingLocation);
  const error = useLocationStore((state) => state.error);
  const { initializeLocation, requestLocation, updateLocation, clearLocation } = useLocationStore();

  useEffect(() => {
    if (skipInit) return;
    initializeLocation(defaultCity, defaultPincode, enableGeolocation);
  }, [defaultCity, defaultPincode, enableGeolocation, initializeLocation, skipInit]);

  return {
    location: userLocation,
    isLoading,
    error,
    requestLocation: () => requestLocation(enableGeolocation),
    updateLocation,
    clearLocation,
  };
}

