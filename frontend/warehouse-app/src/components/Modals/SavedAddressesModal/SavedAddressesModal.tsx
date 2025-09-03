'use client';

import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import ReactCountryFlag from 'react-country-flag';

interface AddressData {
  id?: string;
  companyName: string;
  suite: string;
  address: string;
  country: string;
  phone: string;
}

interface SavedAddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: AddressData) => void;
  savedAddresses: AddressData[];
}

const SavedAddressesModal: React.FC<SavedAddressesModalProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
  savedAddresses
}) => {

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectAddress = (address: AddressData) => {
    onSelectAddress(address);
    onClose();
  };

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
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideIn">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Select Address</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Saved Addresses List */}
          <div className="space-y-4">
            {savedAddresses.map((address, index) => (
              <div
                key={address.id || `address-${index}`}
                onClick={() => handleSelectAddress(address)}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <ReactCountryFlag
                      countryCode={getCountryCode(address.country)}
                      svg
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      title={address.country}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{address.companyName}</h3>
                    <p className="text-sm text-gray-600 mb-1">{address.suite}</p>
                    <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                    <p className="text-sm text-gray-600 mb-1">{address.country}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedAddressesModal;
