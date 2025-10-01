"use client";
import React from "react";
import { X } from "lucide-react";
import { CopyButtonAdvanced } from "../../UI";

interface AddressData {
  id?: string;
  name: string;
  address: string;
  country_name: string;
  country_code: string;
  country_phone_code: string;
  phone_number: string;
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


  if (!isOpen) return null;

  const addressDetails = [
    { label: "Full Address", value: `${addressData.address   } ${  addressData.country_name}` },
    { label: "Full Name", value: addressData.name },
    { label: "Address Line 1", value: addressData.address },
    { label: "Phone Number", value: addressData.phone_number },
    { label: "Country", value: addressData.country_name },
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

        {/* Full Address Table */}
        <div className="px-6 pb-4 mt-4">
          <div className="border bg-gray-200 border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 py-3 px-4 hover:bg-gray-50 transition-colors">
              <div className="col-span-4">
                <span className="text-sm font-semibold text-gray-400">Full Address:</span>
              </div>
              <div className="col-span-7">
                <span className="text-sm font-600 text-gray-600">{addressData.address}</span>
              </div>
              <div className="col-span-1 flex justify-center">
                <CopyButtonAdvanced 
                  text={addressData.address}
                  size="sm"
                  variant="minimal"
                  showTooltip={true}
                />
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
                    {detail.value !== "-" && (
                      <CopyButtonAdvanced 
                        text={detail.value}
                        size="sm"
                        variant="minimal"
                        showTooltip={true}
                      />
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
