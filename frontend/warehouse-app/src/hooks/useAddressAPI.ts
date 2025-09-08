"use client";
import { useEffect } from "react";
import { useAddress, useAddressActions } from "../contexts/AddressContext";
import { getCourierCompanies } from "../lib/api.service";

export const useAddressAPI = () => {
  const { state } = useAddress();
  const actions = useAddressActions();

  // Fetch addresses from API
  const fetchAddresses = async () => {
    try {
      actions.setLoading(true);
      actions.setError(null);

      const addresses = await getCourierCompanies();
      actions.setAddresses(addresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      actions.setError("Failed to fetch addresses");
    }
  };

  // Auto-fetch addresses on mount
  useEffect(() => {
    if (state.savedAddresses.length === 0 && !state.isLoading) {
      fetchAddresses();
    }
  }, []);

  // Get current country info
  const getCurrentCountryInfo = () => {
    return state.availableCountries.find(
      country => country.name === state.selectedCountry
    );
  };

  // Get addresses for current country
  const getAddressesForCurrentCountry = () => {
    const currentCountry = getCurrentCountryInfo();
    if (!currentCountry) return state.savedAddresses;
    
    return state.savedAddresses.filter(
      addr => addr.country_code === currentCountry.code
    );
  };

  // Get selected address with country info
  const getSelectedAddressWithCountry = () => {
    if (!state.selectedAddress) return null;
    
    const countryInfo = getCurrentCountryInfo();
    return {
      ...state.selectedAddress,
      country_info: countryInfo
    };
  };

  return {
    // State
    id: state.id,
    selectedCountry: state.selectedCountry,
    selectedAddress: state.selectedAddress,
    savedAddresses: state.savedAddresses,
    availableCountries: state.availableCountries,
    isLoading: state.isLoading,
    error: state.error,
    
    // Computed values
    currentCountryInfo: getCurrentCountryInfo(),
    addressesForCurrentCountry: getAddressesForCurrentCountry(),
    selectedAddressWithCountry: getSelectedAddressWithCountry(),
    
    // Actions
    selectCountry: actions.selectCountry,
    selectAddress: actions.selectAddress,
    updateAddress: actions.updateAddress,
    addAddress: actions.addAddress,
    removeAddress: actions.removeAddress,
    fetchAddresses,
  };
};
