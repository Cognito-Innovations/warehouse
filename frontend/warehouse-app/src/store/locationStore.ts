import { create } from "zustand";
import { getUserCountryByIP } from "@/utils/getUserCountry";
import { fetchUserAddresses } from "@/lib/api.service";
import { LocationStore, UserLocation } from "./storeTypes";

const useLocationStore = create<LocationStore>((set, get) => ({
  userLocation: {
    city: "Mumbai",
    pincode: "400001",
    countryCode: "IN",
    countryName: "India",
    currency: "USD",
  },
  userAddress: null,
  addressCache: {},
  isLoadingLocation: false,
  isLoadingAddress: false,
  hasInitialized: false,
  error: null,

  setUserLocation: (location) => set({ userLocation: location }),
  setUserAddress: (address) => set({ userAddress: address }),
  setLoadingLocation: (loading) => set({ isLoadingLocation: loading }),
  setLoadingAddress: (loading) => set({ isLoadingAddress: loading }),
  setError: (error) => set({ error }),

  fetchCountryFromIP: async (defaultCity: string, defaultPincode: string, enableGeolocation = true) => {
    try {
      const { countryCode, countryName, currency } = await getUserCountryByIP();

      const userLocation: UserLocation = {
        city: countryCode === "IN" ? "Mumbai" : defaultCity,
        pincode: countryCode === "IN" ? "400001" : defaultPincode,
        countryCode: countryCode || "IN",
        countryName: countryName || "India",
        currency: "USD", // Support requested default currency
      };

      get().setUserLocation(userLocation);
      get().setLoadingLocation(false);
    } catch (error) {
      get().setError("Failed to fetch country from IP");
      get().requestLocation(enableGeolocation);
    }
  },

  requestLocation: (enableGeolocation = true) => {
    if (!enableGeolocation) return;

    if (!navigator.geolocation) {
      get().setError("Geolocation is not supported by this browser");
      get().setLoadingLocation(false);
      return;
    }

    get().setLoadingLocation(true);
    get().setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                "User-Agent": "Palakart Ecommerce App",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Geocoding service unavailable");
          }

          const data = await response.json();
          const address = data.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state_district ||
            "";

          const pincode = address.postcode || "";
          const ipGeo = await getUserCountryByIP();
          const userLocation: UserLocation = {
            city,
            pincode,
            countryCode: ipGeo.countryCode,
            countryName: address.country || ipGeo.countryName,
            currency: ipGeo.currency
          };

          get().setUserLocation(userLocation);
          get().setError(null);
        } catch (err: any) {
          get().setError(err.message || "Failed to get location details");
        } finally {
          get().setLoadingLocation(false);
        }
      },
      (geolocationError) => {
        const errorCode = geolocationError?.code ?? 0;
        get().setError(getGeolocationErrorMessage(errorCode));
        get().setLoadingLocation(false);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000,
      }
    );
  },

  initializeLocation: async (defaultCity: string, defaultPincode: string, enableGeolocation = true) => {
    const { hasInitialized, isLoadingLocation, userLocation } = get();
    if (isLoadingLocation || hasInitialized) return;

    if (userLocation.countryCode || (userLocation.city && userLocation.city !== defaultCity)) {
      return;
    }

    get().setLoadingLocation(true);
    get().setError(null);
    set({ hasInitialized: true });

    try {
      await get().fetchCountryFromIP(defaultCity, defaultPincode, enableGeolocation);
    } catch (error) {
      get().setLoadingLocation(false);
    }
  },

  fetchUserAddress: async (userId: string) => {
    const state = get();
    if (state.isLoadingAddress) return;

    if (state.addressCache[userId] !== undefined) {
      state.setUserAddress(state.addressCache[userId]);
      return;
    }

    get().setLoadingAddress(true);
    get().setError(null);

    try {
      const data = await fetchUserAddresses(userId);
      get().setUserAddress(data);
      set((state) => ({
        addressCache: { ...state.addressCache, [userId]: data },
      }));
    } catch (error) {
      get().setUserAddress(null);
      set((state) => ({
        addressCache: { ...state.addressCache, [userId]: null },
      }));
    } finally {
      get().setLoadingAddress(false);
    }
  },

  refreshUserAddress: async (userId: string) => {
    get().setLoadingAddress(true);
    try {
      const updatedAddress = await fetchUserAddresses(userId);
      get().setUserAddress(updatedAddress);
      set((state) => ({
        addressCache: { ...state.addressCache, [userId]: updatedAddress },
      }));
    } catch (error) {
      console.error("Failed to refresh addresses:", error);
      get().setUserAddress(null);
      set((state) => ({
        addressCache: { ...state.addressCache, [userId]: null },
      }));
    } finally {
      get().setLoadingAddress(false);
    }
  },

  updateLocation: (newLocation: UserLocation) => {
    get().setUserLocation(newLocation);
  },

  clearLocation: () => {
    get().setUserLocation({
      city: "",
      pincode: "",
      countryCode: undefined,
      countryName: undefined,
      currency: undefined,
    });
    get().setUserAddress(null);
    get().setError(null);
  },
}));

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

export default useLocationStore;