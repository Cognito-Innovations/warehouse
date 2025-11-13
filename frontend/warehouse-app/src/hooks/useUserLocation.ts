"use client";

import { useState, useEffect } from "react";
import { getUserCountryByIP } from "@/utils/getUserCountry";

interface UserLocation {
  city: string;
  pincode: string;
  countryCode?: string;
  countryName?: string;
}

interface UseUserLocationOptions {
  defaultCity: string;
  defaultPincode: string;
  enableGeolocation?: boolean;
}

export function useUserLocation({
  defaultCity,
  defaultPincode,
  enableGeolocation = true,
}: UseUserLocationOptions) {
  const [location, setLocation] = useState<UserLocation>({
    city: defaultCity,
    pincode: defaultPincode,
    countryCode: undefined,
    countryName: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      try {
        const parsed = JSON.parse(storedLocation) as UserLocation;
        setLocation({
          city: parsed.city || defaultCity,
          pincode: parsed.pincode || defaultPincode,
          countryCode: parsed.countryCode,
          countryName: parsed.countryName,
        });
        return;
      } catch (e) {
        localStorage.removeItem("userLocation");
      }
    }
    getUserCountryByIP().then(({ countryCode, countryName }) => {
      setLocation((prev) => ({ ...prev, countryCode, countryName }));
    });
  }, [defaultCity, defaultPincode]);

  const requestLocation = () => {
    if (!enableGeolocation) {
      return;
    }
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }
    setIsLoading(true);
    setError(null);

    // Request user's current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                "User-Agent": "Palakart Ecommerce App", // Required by Nominatim
              },
            }
          );

          if (!response.ok) {
            throw new Error("Geocoding service unavailable");
          }

          const data = await response.json();
          const address = data.address || {};

          // Extract city and pincode from the address
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state_district ||
            defaultCity;

          const pincode = address.postcode || defaultPincode;
          getUserCountryByIP().then((ipGeo) => {
            const userLocation: UserLocation = { city, pincode, countryCode: ipGeo.countryCode, countryName: address.country || ipGeo.countryName };

            // Store in localStorage for future use
            localStorage.setItem("userLocation", JSON.stringify(userLocation));
            setLocation(userLocation);
            setError(null);
          });
        } catch (err: any) {
          setError(err.message || "Failed to get location details");
        } finally {
          setIsLoading(false);
        }
      },
      (geolocationError) => {
        // Handle geolocation errors gracefully
        const errorCode = geolocationError?.code ?? 0;
        setError(getGeolocationErrorMessage(errorCode));
        setIsLoading(false);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  };

  // Function to manually update location
  const updateLocation = (newLocation: UserLocation) => {
    setLocation(newLocation);
    localStorage.setItem("userLocation", JSON.stringify(newLocation));
  };

  // Function to clear stored location and use defaults
  const clearLocation = () => {
    localStorage.removeItem("userLocation");
    setLocation({ city: defaultCity, pincode: defaultPincode, countryCode: undefined, countryName: undefined });
  };

  return {
    location,
    isLoading,
    error,
    requestLocation,
    updateLocation,
    clearLocation,
  };
}

function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location permission denied";
    case 2:
      return "Location unavailable";
    case 3:
      return "Location request timeout";
    case 0:
      return "Failed to get location";
    default:
      return "Failed to get location";
  }
}

