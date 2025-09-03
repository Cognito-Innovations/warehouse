'use client';
import React from 'react';
import { X, Copy, Info } from 'lucide-react';

interface AddressData {
  id?: string;
  companyName: string;
  suite: string;
  address: string;
  country: string;
  phone: string;
}

interface AddressDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressData: AddressData;
}

const AddressDetailsModal: React.FC<AddressDetailsModalProps> = ({isOpen, onClose, addressData}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  // Parse the address data to extract components
  const fullAddress = `${addressData.address}, ${addressData.suite}, ${addressData.country}`;
  const suiteNo = addressData.suite;
  const addressLine1 = addressData.address;
  const addressLine2 = '-';
  const phoneNumber = addressData.phone;
  
  // Extract postal code, district, city, state from address (you might want to structure this better)
  const postalCode = '637502'; // This should come from your data structure
  const district = 'Elampillai';
  const city = 'Salem';
  const state = 'Tamil Nadu';
  const country = addressData.country;

  const addressDetails = [
    { label: 'Full Address', value: fullAddress },
    { label: 'Full Name', value: addressData.companyName },
    { label: 'Suite No.', value: suiteNo },
    { label: 'Address Line 1', value: addressLine1 },
    { label: 'Address Line 2', value: addressLine2 },
    { label: 'Phone Number', value: phoneNumber },
    { label: 'Postal Code', value: postalCode },
    { label: 'District', value: district },
    { label: 'City', value: city },
    { label: 'State', value: state },
    { label: 'Country', value: country },
  ];

  return (
    <div  className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="mx-6 mt-6 mb-4">
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-blue-800 text-sm">
              Kindly ensure that your address includes <span className="font-bold">Suite No. ({suiteNo})</span>
            </p>
          </div>
        </div>

        {/* Full Address Table */}
        <div className="px-6 pb-4">
          <div className="border bg-gray-200 border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 py-3 px-4 hover:bg-gray-50 transition-colors">
              <div className="col-span-4">
                <span className="text-sm font-semibold text-gray-400">Full Address:</span>
              </div>
              <div className="col-span-7">
                <span className="text-sm font-600 text-gray-600">{fullAddress}</span>
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => handleCopy(fullAddress)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Address Details Table */}
        <div className="px-6 pb-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Content */}
            <div className="divide-y divide-gray-200">
              {addressDetails.slice(1).map((detail, index) => (
                <div key={detail.label} className="grid grid-cols-12 gap-4 py-3 px-4 hover:bg-gray-50 transition-colors">
                  <div className="col-span-4">
                    <span className="text-sm font-medium text-gray-700">{detail.label}</span>
                  </div>
                  <div className="col-span-7">
                    <span className="text-sm text-gray-900">{detail.value}</span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {detail.value !== '-' && (
                      <button
                        onClick={() => handleCopy(detail.value)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsModal;
