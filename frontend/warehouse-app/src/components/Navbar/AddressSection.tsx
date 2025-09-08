'use client';
import React, { useState, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useAddressAPI } from '../../hooks/useAddressAPI';

interface AddressSectionProps {
  currentCountry?: string;
  onCountryChange?: (country: string) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  currentCountry,
  onCountryChange
}) => {
  const { 
    selectedCountry, 
    availableCountries, 
    selectCountry 
  } = useAddressAPI();
  
  const [isClient, setIsClient] = useState(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle currentCountry prop changes
  useEffect(() => {
    if (currentCountry && currentCountry !== selectedCountry) {
      selectCountry(currentCountry);
    }
  }, [currentCountry, selectedCountry, selectCountry]);

  const handleCountrySelect = (country: string) => {
    selectCountry(country);
    onCountryChange?.(country);
  };

  const getCountryCode = (country: string) => {
    const countryInfo = availableCountries.find(c => c.name === country);
    return countryInfo?.code || '';
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Current Country */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              {isClient ? (
                <ReactCountryFlag 
                  countryCode={getCountryCode(selectedCountry)}
                  svg
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
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

          {/* Right Side - Country Selection */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {availableCountries.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountrySelect(country.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedCountry === country.name
                      ? 'border-purple-600 shadow-md scale-110'
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                  }`}
                  title={country.name}
                >
                  <ReactCountryFlag 
                    countryCode={country.code}
                    svg
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">To change country click flag</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
