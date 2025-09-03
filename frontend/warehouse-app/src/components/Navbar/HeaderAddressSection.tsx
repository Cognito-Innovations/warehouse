'use client';

import React from 'react';
import ReactCountryFlag from 'react-country-flag';

interface AddressData {
  id?: string;
  companyName: string;
  suite: string;
  address: string;
  country: string;
  phone: string;
}

interface HeaderAddressSectionProps {
  addressData: AddressData;
  onOpenSavedAddressesModal: () => void;
  onOpenAddressDetailsModal: () => void;
}

const HeaderAddressSection: React.FC<HeaderAddressSectionProps> = ({
  addressData,
  onOpenSavedAddressesModal,
  onOpenAddressDetailsModal
}) => {
  const getCountryCode = (country: string) => {
    const countryMap: { [key: string]: string } = {
      'South Korea': 'KR',
      'United States': 'US',
      'United Kingdom': 'GB',
      'Japan': 'JP',
      'China': 'CN',
      'Singapore': 'SG',
      'Australia': 'AU',
      'Canada': 'CA',
      'India': 'IN'
    };
    return countryMap[country] || 'KR';
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-5">
          {/* Country Flag */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              <ReactCountryFlag 
                countryCode={getCountryCode(addressData.country)}
                svg
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                title={addressData.country}
              />
            </div>
            <button 
              onClick={onOpenSavedAddressesModal}
              className="bg-transparent border border-purple-700 text-purple-700 px-4 py-2 rounded text-sm font-medium hover:bg-purple-50 transition-colors"
            >
              Change
            </button>
          </div>
        
          {/* Address Information */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{addressData.companyName}</h3>
            <p className="text-sm text-gray-600 mb-1">{addressData.suite}</p>
            <p className="text-sm text-gray-600 mb-1">{addressData.address}</p>
            <p className="text-sm text-gray-600 mb-1">{addressData.country}</p>
            <p className="text-sm text-gray-600 mb-1">{addressData.phone}</p>

            <div className="flex items-center gap-4">
              <button 
                onClick={onOpenAddressDetailsModal}
                className="text-purple-700 text-sm font-medium hover:underline"
              >
                View Address Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAddressSection;
