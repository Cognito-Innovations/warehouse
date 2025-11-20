"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserAddresses } from "@/lib/api.service";
import { useUserLocation } from "./useUserLocation";
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

const addressCache: Record<string, UserAddress | null> = {};

export function useEffectiveUserLocation(
  defaults: { countryCode?: string; countryName?: string; city: string; pincode: string }
): UseEffectiveUserLocationReturn {
  const { user } = useAuth();
  const geoHook = useUserLocation({
    defaultCity: defaults.city,
    defaultPincode: defaults.pincode,
    enableGeolocation: true,
  });

  const [address, setAddress] = useState<UserAddress | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      if (addressCache[user.id] !== undefined) {
        setAddress(addressCache[user.id]);
        setAddressLoading(false);
      } else {
        setAddressLoading(true);
        fetchUserAddresses(user.id)
          .then((data) => {
            setAddress(data);
            addressCache[user.id] = data; 
          })
          .catch(() => {
            setAddress(null);
            addressCache[user.id] = null;
          })
          .finally(() => setAddressLoading(false));
      }
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
        
        addressCache[user.id] = updatedAddress; 
      } catch (err) {
        console.error("Failed to refresh addresses:", err);
        setAddress(null);
        addressCache[user.id] = null;
      } finally {
        setAddressLoading(false);
      }
    }
  }, [user?.id]);

  const isLoggedIn = !!user;
  const hasValidAddress = isLoggedIn && !!address && !!address.city && !!address.zip_code;

  const location: EffectiveUserLocation = hasValidAddress
    ? {
        countryCode: geoHook.location.countryCode,
        countryName: address.country,
        city: address.city,
        pincode: address.zip_code,
      }
    : {
        countryCode: geoHook.location.countryCode,
        countryName: geoHook.location.countryName,
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