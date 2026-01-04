"use client";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef } from "react";
import { getCountries, getUserPreferences, getCurrencies, getCourierCompanies, createUserPreferences } from "@/lib/api.service";
import { useAuth } from "./AuthContext";

// Types
export interface AddressData {
  id: string;
  country_id: string;
  email?: string;
  name: string;
  address: string;
  country_name: string;
  country_code: string;
  country_phone_code: string;
  phone_number: string;
}

export interface Country {
  name: string;
  code: string;
  phone_code: string;
}

export interface AddressState {
  id: string;
  selectedCountry: string;
  availableCountries: Country[];
  savedAddresses: AddressData[];
  selectedAddress: AddressData;
  isLoading: boolean;
  error: string | null;
}

// Action Types
export type AddressAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_COUNTRIES"; payload: Country[] }
  | { type: "SET_ADDRESSES"; payload: AddressData[] }
  | { type: "SELECT_COUNTRY"; payload: string }
  | { type: "SELECT_ADDRESS"; payload: AddressData }
  | { type: "UPDATE_ADDRESS"; payload: AddressData }
  | { type: "ADD_ADDRESS"; payload: AddressData }
  | { type: "REMOVE_ADDRESS"; payload: string }
  | { type: "LOAD_USER_PREFERENCES_SUCCESS"; payload: AddressData }

const initialAddress: AddressData = {
  country_id: "",
  country_code: "",
  id: "",
  name: "",
  address: "",
  country_name: "",
  country_phone_code: "",
  phone_number: "",
};

// Initial State
const initialState: AddressState = {
  id: "",
  selectedCountry: "India",
  availableCountries: [
    { name: "India", code: "IN", phone_code: "+91" },
  ],
  savedAddresses: [],
  selectedAddress: initialAddress,
  isLoading: false,
  error: null,
};

const mapCourierToAddress = (courier: any): AddressData => {
  return {
    id: courier.id ?? "",
    country_id: courier.country?.id ?? courier.country_id ?? "",
    name: courier.name ?? (courier.company_name ?? ""),
    address: courier.address ?? courier.location ?? "",
    country_name: courier.country?.name ?? courier.country_name ?? courier.countryName ?? "",
    country_code: courier.country?.code ?? courier.country_code ?? courier.countryCode ?? "",
    country_phone_code: courier.country?.phone_code ?? courier.country_phone_code ?? courier.countryPhoneCode ?? "",
    phone_number: courier.phone_number ?? courier.contact_number ?? courier.phone ?? "",
  };
};

// Reducer
function addressReducer(state: AddressState, action: AddressAction): AddressState {

  switch (action.type) {

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_COUNTRIES":
      return { ...state, availableCountries: action.payload, isLoading: false };

    case "SET_ADDRESSES":
      return {
        ...state,
        savedAddresses: action.payload,
        selectedAddress: state.selectedAddress?.id
          ? state.selectedAddress
          : (action.payload.length > 0 ? action.payload[0] : initialAddress),
        isLoading: false
      };

    case "SELECT_COUNTRY":
      return {
        ...state,
        selectedCountry: action.payload,
      };

    case "SELECT_ADDRESS":
      return { ...state, selectedAddress: action.payload };

    case "UPDATE_ADDRESS":
      return {
        ...state,
        savedAddresses: state.savedAddresses.map(addr =>
          addr.id === action.payload.id ? action.payload : addr
        ),
        selectedAddress: state.selectedAddress?.id === action.payload.id
          ? action.payload
          : state.selectedAddress
      };

    case "ADD_ADDRESS":
      return {
        ...state,
        savedAddresses: [...state.savedAddresses, action.payload]
      };

    case "REMOVE_ADDRESS":
      return {
        ...state,
        savedAddresses: state.savedAddresses.filter(addr => addr.id !== action.payload),
        selectedAddress: state.selectedAddress?.id === action.payload
          ? initialAddress
          : state.selectedAddress
      };

    case "LOAD_USER_PREFERENCES_SUCCESS":
      return {
        ...state,
        selectedAddress: action.payload,
        isLoading: false,
        error: null
      };

    default:
      return state;
  }
}

// Context
const AddressContext = createContext<{
  state: AddressState;
  dispatch: React.Dispatch<AddressAction>;
} | null>(null);

// Provider Component
interface AddressProviderProps {
  children: ReactNode;
}

const setupDefaultPreferences = async (userId: string, dispatch: React.Dispatch<AddressAction>, currencyCode: string) => {
  try {
    const [currencies, couriers] = await Promise.all([
      getCurrencies(),
      getCourierCompanies(),
    ]);

    // Force India as default country
    const countryCode = "IN";
    // currencyCode is passed from ineffectiveUserLocation hook

    // Find matching currency ID
    let currency = currencies.find((c: any) => c.currency_code.toUpperCase() === currencyCode.toUpperCase());
    if (!currency && currencyCode !== "INR") {
      currency = currencies.find((c: any) => c.currency_code.toUpperCase() === "INR");
    }
    // Final fallback to first currency if still null
    if (!currency) currency = currencies[0];

    // Find a courier in the detected country (prefer India if not specified)
    let courier = couriers.find((c: any) => (c.country_code || c.country?.code) === countryCode);
    if (!courier && countryCode !== "IN") {
      courier = couriers.find((c: any) => (c.country_code || c.country?.code) === "IN");
    }
    // Final fallback to first courier
    if (!courier) courier = couriers[0];

    if (currency && courier) {
      await createUserPreferences({
        user_id: userId,
        currency_id: currency.id,
        courier_id: courier.id
      });
      // Reload preferences after creation
      const prefs = await getUserPreferences(userId);
      if (prefs?.courier) {
        const mappedAddress = {
          ...mapCourierToAddress(prefs.courier),
          suite_no: prefs?.user?.suite_no || "",
        };
        dispatch({ type: "LOAD_USER_PREFERENCES_SUCCESS", payload: mappedAddress });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  } catch (error) {
    console.error("[ADDRESS_CONTEXT] Failed to setup default preferences:", error);
    dispatch({ type: "SET_LOADING", payload: false });
  }
};

//TODO: Remove this function everywhere
const loadUserPreferences = async (userId: string, dispatch: React.Dispatch<AddressAction>) => {
  dispatch({ type: "SET_LOADING", payload: true });
  try {
    const prefs = await getUserPreferences(userId);

    if (prefs?.courier) {
      const mappedAddress = {
        ...mapCourierToAddress(prefs.courier),
        suite_no: prefs?.user?.suite_no || "",
      };
      dispatch({ type: "LOAD_USER_PREFERENCES_SUCCESS", payload: mappedAddress });
    } else {
      // Preference missing, trigger auto-setup
      // Preference missing. We'll handle setup in the component body using the hook.
      dispatch({ type: "SET_LOADING", payload: false });
    }
  } catch (error) {
    console.error("[ADDRESS_CONTEXT] Failed to load user preferences:", error);
    dispatch({ type: "SET_ERROR", payload: "Failed to load address details. Please try again." });
  }
};

export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(addressReducer, initialState);
  const { user } = useAuth();

  // Load saved country from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCountry = localStorage.getItem("selectedCountry");
      if (savedCountry) {
        dispatch({ type: "SELECT_COUNTRY", payload: savedCountry });
      }
    }
  }, []);

  // Fetch countries
  const fetchCountries = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const countries = await getCountries();
      const formattedCountries: Country[] = countries.map((country: any) => ({
        name: country.name,
        code: country.code,
        phone_code: country.phone_code,
      }));
      dispatch({ type: "SET_COUNTRIES", payload: formattedCountries });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load countries" });
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const { currencyInfo, isLoading: isGeoLoading } = useEffectiveUserLocation({
    city: "Mumbai",
    pincode: "400001",
    countryCode: "IN",
    countryName: "India"
  });

  const setupInitiated = useRef<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadUserPreferences(user.id, dispatch);
    } else {
      dispatch({ type: "SELECT_ADDRESS", payload: initialAddress });
      setupInitiated.current = null;
    }
  }, [user?.id]);

  // Separate effect for setup if missing
  useEffect(() => {
    // If user is logged in, not loading preferences, and address is still empty
    // AND effective location has finished determining the currency
    if (user?.id && !state.isLoading && !state.selectedAddress.id && !isGeoLoading) {
      if (setupInitiated.current !== user.id) {
        setupInitiated.current = user.id;
        setupDefaultPreferences(user.id, dispatch, currencyInfo.code);
      }
    }
  }, [user?.id, state.isLoading, state.selectedAddress.id, isGeoLoading, currencyInfo.code]);

  return (
    <AddressContext.Provider value={{ state, dispatch }}>
      {children}
    </AddressContext.Provider>
  );
};

