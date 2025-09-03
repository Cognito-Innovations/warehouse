'use client';

import React, { useState } from 'react';
import { Close as CloseIcon, Inventory as PackageIcon } from '@mui/icons-material';

interface PrePackageArrivalOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OTPFormData) => void;
}

interface OTPFormData {
  otp: string;
  trackingNumber: string;
  estimatedArrivalTime: string;
  otherDetails: string;
}

const PrePackageArrivalOTPModal: React.FC<PrePackageArrivalOTPModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<OTPFormData>({
    otp: '',
    trackingNumber: '',
    estimatedArrivalTime: '',
    otherDetails: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideIn">
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Pre Package Arrival OTP</h2>
            <p className="text-sm text-gray-600">Share OTP</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* OTP and Tracking Number Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Tracking / Order Number
              </label>
              <input
                type="text"
                id="trackingNumber"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Estimated Arrival Time */}
          <div className="mb-4">
            <label htmlFor="estimatedArrivalTime" className="block text-sm font-semibold text-gray-700 mb-2">
              Estimated Arrival Time <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="estimatedArrivalTime"
              name="estimatedArrivalTime"
              value={formData.estimatedArrivalTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1 italic">
              Eg: Between 23 jan 2021 10:00 AM - 14:00 PM
            </p>
          </div>

          {/* Other Details */}
          <div className="mb-6">
            <label htmlFor="otherDetails" className="block text-sm font-semibold text-gray-700 mb-2">
              Other Details
            </label>
            <textarea
              id="otherDetails"
              name="otherDetails"
              value={formData.otherDetails}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical min-h-[100px]"
              placeholder="Brief description for your packages"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1 italic">
              Eg: 2 Package of electronics
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-700 text-white rounded-md text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <PackageIcon className="w-4 h-4" />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrePackageArrivalOTPModal;
