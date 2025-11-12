"use client";

import { useState, useEffect } from "react";

interface UserLocation {
  city: string;
  pincode: string;
  country: string;
}

interface UseUserLocationOptions {
  defaultCity: string;
  defaultPincode: string;
  defaultCountry?: string;
  enableGeolocation?: boolean;
}

export function useUserLocation({
  defaultCity,
  defaultPincode,
  defaultCountry = 'IN',
  enableGeolocation = true,
}: UseUserLocationOptions) {
  const [location, setLocation] = useState<UserLocation>({
    city: defaultCity,
    pincode: defaultPincode,
    country: defaultCountry,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if location is already stored in localStorage
    // This is safe to do on mount as it doesn't require user permission
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      try {
        const parsed = JSON.parse(storedLocation) as UserLocation;
        const validParsed = {
          city: parsed.city || defaultCity,
          pincode: parsed.pincode || defaultPincode,
          country: parsed.country || defaultCountry,
        };
        setLocation(validParsed);
      } catch (e) {
        // Invalid stored data, use defaults
        localStorage.removeItem("userLocation");
      }
    }
  }, [defaultCity, defaultPincode, defaultCountry]);

  // Function to request location (must be called in response to user gesture)
  const requestLocation = () => {
    // If geolocation is disabled, use defaults
    if (!enableGeolocation) {
      return;
    }

    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser");
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
          const country = address.country || defaultCountry;

          const userLocation: UserLocation = { city, pincode, country };

          // Store in localStorage for future use
          localStorage.setItem("userLocation", JSON.stringify(userLocation));
          setLocation(userLocation);
          setError(null);
        } catch (err: any) {
          console.error("Reverse geocoding failed:", err);
          setError(err.message || "Failed to get location details");
          // Use default location on error
          setLocation({ city: defaultCity, pincode: defaultPincode, country: defaultCountry });
        } finally {
          setIsLoading(false);
        }
      },
      (geolocationError) => {
        // Handle geolocation errors gracefully
        const errorCode = geolocationError?.code ?? 0;
        const errorMessage = geolocationError?.message || "Unknown geolocation error";
        
        // Only log if it's not a permission denied error (common and expected)
        if (errorCode !== 1) {
          console.warn("Geolocation error:", {
            code: errorCode,
            message: errorMessage,
            error: geolocationError,
          });
        }
        
        setError(getGeolocationErrorMessage(errorCode));
        setIsLoading(false);
        // Use default location on error
        setLocation({ city: defaultCity, pincode: defaultPincode, country: defaultCountry });
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
    setLocation({ city: defaultCity, pincode: defaultPincode, country: defaultCountry });
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

