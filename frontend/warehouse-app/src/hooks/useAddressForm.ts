"use client";
import { useAddressAPI } from "./useAddressAPI";

/**
 * Hook for forms that need address data
 * Provides current country info and address data for API calls
 */
export const useAddressForm = () => {
  const {
    selectedCountry,
    selectedAddress,
    currentCountryInfo,
    selectedAddressWithCountry,
    addressesForCurrentCountry,
    savedAddresses,
    selectCountry,
    selectAddress,
    updateAddress,
    addAddress,
    removeAddress,
  } = useAddressAPI();

  // Get country ID for API calls (you might need to map this to your backend)
  const getCountryId = () => {
    // This should map to your backend country IDs
    const countryIdMap: { [key: string]: string } = {
      "India": "country-id-1",
      "Singapore": "country-id-2",
      "USA": "country-id-3",
      // Add more mappings as needed
    };
    return countryIdMap[selectedCountry] || "country-id-1";
  };

  // Get admin ID (you might get this from user context)
  const getAdminId = () => {
    // This should come from your user context/auth
    return "admin-id-1"; // Replace with actual admin ID
  };

  // Prepare data for API calls
  const getFormData = () => {
    return {
      country_id: getCountryId(),
      admin_id: getAdminId(),
      country_code: currentCountryInfo?.code || "SG",
      country_name: currentCountryInfo?.name || "Singapore",
      country_phone_code: currentCountryInfo?.phone_code || "+65",
    };
  };

  // Prepare pickup request data
  const getPickupRequestData = (additionalData: any) => {
    return {
      ...additionalData,
      country_id: getCountryId(),
      admin_id: getAdminId(),
    };
  };

  // Prepare shopping request data
  const getShoppingRequestData = (additionalData: any) => {
    return {
      ...additionalData,
      country_id: getCountryId(),
      admin_id: getAdminId(),
    };
  };

  return {
    // State
    selectedCountry,
    selectedAddress,
    currentCountryInfo,
    selectedAddressWithCountry,
    addressesForCurrentCountry,
    savedAddresses,
    
    // Actions
    selectCountry,
    selectAddress,
    updateAddress,
    addAddress,
    removeAddress,
    
    // Helpers
    getCountryId,
    getAdminId,
    getFormData,
    getPickupRequestData,
    getShoppingRequestData,
  };
};
