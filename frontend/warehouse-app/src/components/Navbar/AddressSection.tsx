"use client";
import React, { useState, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import { useAddressAPI } from "../../hooks/useAddressAPI";

const AddressSection = () => {
  const {
    selectedCountry, 
    availableCountries,
  } = useAddressAPI();
  
  const [isClient, setIsClient] = useState(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCountryCode = (country: string) => {
    const countryInfo = availableCountries.find(c => c.name === country);
    return countryInfo?.code || "";
  };
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              {isClient ? (
                <ReactCountryFlag 
                  countryCode={getCountryCode(selectedCountry)}
                  svg
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                  title={selectedCountry}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{selectedCountry}</h3>
              <p className="text-sm text-gray-600">Shopping Request from {selectedCountry}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
