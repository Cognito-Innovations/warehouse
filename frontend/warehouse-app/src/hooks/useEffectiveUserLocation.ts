"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationStore } from "@/store/locationStore";

export function useDetectUserLocation() {
  const { user } = useAuth();
  const {
    currencyCode,
    currencySymbol,
    currencyRate,
    countryCode,
    isLoaded,
    fetchLocation,
  } = useLocationStore();

  useEffect(() => {
    fetchLocation(user?.id);
  }, [user?.id, fetchLocation]);

  return {
    currencyCode,
    currencySymbol,
    currencyRate,
    countryCode,
    isLoaded,
  };
}