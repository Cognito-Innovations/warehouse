"use client";
import { getCountries, getUserPreferences } from "@/lib/api.service";
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
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

const loadUserPreferences = async (userId: string, dispatch: React.Dispatch<AddressAction>) => {
  dispatch({ type: "SET_LOADING", payload: true });
  try {
    const prefs = await getUserPreferences(userId);
    
    if (prefs?.courier) {
      const mappedAddress = mapCourierToAddress(prefs.courier);
      dispatch({ type: "LOAD_USER_PREFERENCES_SUCCESS", payload: mappedAddress });
    } else {
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

  useEffect(() => {
    if (user?.id) {
      loadUserPreferences(user.id, dispatch);
    } else {
      dispatch({ type: "SELECT_ADDRESS", payload: initialAddress });
    }
  }, [user?.id]);

  return (
    <AddressContext.Provider value={{ state, dispatch }}>
      {children}
    </AddressContext.Provider>
  );
};

// Custom Hook
export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};

// Selector Hooks for better performance
export const useSelectedCountry = () => {
  const { state } = useAddress();
  return state.selectedCountry;
};

export const useSelectedAddress = () => {
  const { state } = useAddress();
  return state.selectedAddress;
};

export const useSavedAddresses = () => {
  const { state } = useAddress();
  return state.savedAddresses;
};

export const useAvailableCountries = () => {
  const { state } = useAddress();
  return state.availableCountries;
};

export const useAddressLoading = () => {
  const { state } = useAddress();
  return state.isLoading;
};

// Action Creators
export const useAddressActions = () => {
  const { dispatch } = useAddress();
  const { user } = useAuth();

  return {
    setLoading: (loading: boolean) => 
      dispatch({ type: "SET_LOADING", payload: loading }),
    
    setError: (error: string | null) => 
      dispatch({ type: "SET_ERROR", payload: error }),
    
    setCountries: (countries: Country[]) => 
      dispatch({ type: "SET_COUNTRIES", payload: countries }),
    
    setAddresses: (addresses: AddressData[]) => 
      dispatch({ type: "SET_ADDRESSES", payload: addresses }),
    
    selectCountry: (country: string) => 
      dispatch({ type: "SELECT_COUNTRY", payload: country }),
    
    selectAddress: (address: AddressData) => 
      dispatch({ type: "SELECT_ADDRESS", payload: address }),
    
    updateAddress: (address: AddressData) => 
      dispatch({ type: "UPDATE_ADDRESS", payload: address }),
    
    addAddress: (address: AddressData) => 
      dispatch({ type: "ADD_ADDRESS", payload: address }),
    
    removeAddress: (id: string) => 
      dispatch({ type: "REMOVE_ADDRESS", payload: id }),

     refreshUserPreferences: async () => {
      if (user?.id) {
        await loadUserPreferences(user.id, dispatch);
      }
    }
  };
};
