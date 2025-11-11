"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserAddresses } from "@/lib/api.service";
import { useUserLocation } from "./useUserLocation";
import { UserAddress } from "@/types/ecommerce";

export interface EffectiveUserLocation {
  country: string;
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
  defaults: { country: string; city: string; pincode: string }
): UseEffectiveUserLocationReturn {
  const { user } = useAuth();
  const geoHook = useUserLocation({
    defaultCity: defaults.city,
    defaultPincode: defaults.pincode,
    defaultCountry: defaults.country,
    enableGeolocation: true,
  });

  const [address, setAddress] = useState<UserAddress | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setAddressLoading(true);
      fetchUserAddresses(user.id)
        .then(setAddress)
        .catch((err) => {
          console.error("Failed to fetch addresses:", err);
          setAddress(null);
        })
        .finally(() => setAddressLoading(false));
    } else {
      setAddress(null);
      setAddressLoading(false);
    }
  }, [user?.id]);

  const refreshAddresses = useCallback(async () => {
    if (user?.id) {
      setAddressLoading(true);
      try {
        const updatedAddress = await fetchUserAddresses(user.id);
        setAddress(updatedAddress);
      } catch (err) {
        console.error("Failed to refresh addresses:", err);
        setAddress(null);
      } finally {
        setAddressLoading(false);
      }
    }
  }, [user?.id]);

  const isLoggedIn = !!user;
  const hasValidAddress = isLoggedIn && !!address && !!address.city && !!address.zip_code;

  const location: EffectiveUserLocation = hasValidAddress
    ? {
        country: address.country || defaults.country,
        city: address.city,
        pincode: address.zip_code,
      }
    : {
        country: geoHook.location.country,
        city: geoHook.location.city,
        pincode: geoHook.location.pincode,
      };

  const isLoading = geoHook.isLoading || addressLoading;
  const error = geoHook.error;

  return {
    location,
    isLoading,
    error,
    isLoggedIn,
    hasValidAddress,
    address,
    refreshAddresses,
    geoHook,
  };
}