"use client";

//TODO: Rework on it by removing and use zustand store
export const useAddressAPI = () => {
  
  const state = {};
  const actions = {};

  return {
    // State
    id: state.id,
    selectedCountry: state.selectedCountry,
    selectedAddress: state.selectedAddress,
    savedAddresses: state.savedAddresses,
    availableCountries: state.availableCountries,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    selectCountry: actions.selectCountry,
    selectAddress: actions.selectAddress,
    updateAddress: actions.updateAddress,
    addAddress: actions.addAddress,
    removeAddress: actions.removeAddress,
    refreshUserPreferences: actions.refreshUserPreferences,
  };
};
