'use client';

import { Skeleton, Box } from '@mui/material';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';

interface AddressData {
  id?: string;
  name: string;
  address: string;
  country_name: string;
  country_code: string;
  country_phone_code: string;
  phone_number: string;
}

interface HeaderAddressSectionProps {
  addressData: AddressData | null;
  isLoading: boolean;
  onOpenSavedAddressesModal: () => void;
  onOpenAddressDetailsModal: () => void;
}

const HeaderAddressSection: React.FC<HeaderAddressSectionProps> = ({
  addressData,
  isLoading,
  onOpenSavedAddressesModal,
  onOpenAddressDetailsModal
}) => {
  if (isLoading || !addressData || !addressData.id) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="50%" />
            </Box>
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-5">
          {/* Country Flag */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
              <ReactCountryFlag 
                countryCode={addressData.country_code}
                svg
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                title={addressData.country_name}
              />
            </div>
          </div>
        
          {/* Address Information */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{addressData.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{addressData.address}</p>
            <p className="text-sm text-gray-600 mb-1">{addressData.country_name}</p>
            <p className="text-sm text-gray-600 mb-1">{addressData.phone_number}</p>

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
