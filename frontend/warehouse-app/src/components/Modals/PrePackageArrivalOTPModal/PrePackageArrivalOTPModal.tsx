'use client';

import React, { useEffect, useState } from "react";
import { Close as CloseIcon, Inventory as PackageIcon } from '@mui/icons-material';
import { Loader2 } from "lucide-react";

interface PrePackageArrivalOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    customer?: string;
    suite?: string;
    otp: string | number;
    tracking_no?: string | null;
    estimate_arrival_time?: string | null;
    details?: string | null;
  }) => void;
  isLoading?: boolean;
}

interface OTPFormData {
  otp: string;
  trackingNumber: string;
  estimatedArrivalTime: string;
  otherDetails: string;
}

const PrePackageArrivalOTPModal: React.FC<PrePackageArrivalOTPModalProps> = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<OTPFormData>({
    otp: '',
    trackingNumber: '',
    estimatedArrivalTime: '',
    otherDetails: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        otp: '',
        trackingNumber: '',
        estimatedArrivalTime: '',
        otherDetails: ''
      });
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.otp) {
      setError("Please enter the OTP.");
      return;
    }

    // prepare payload and hand to parent via onSubmit (no network here)
    const payload = {
      otp: formData.otp,
      tracking_no: formData.trackingNumber || null,
      estimate_arrival_time: formData.estimatedArrivalTime || null,
      details: formData.otherDetails || null,
      status: "pending",
      // customer / suite can be merged by parent/hook if missing
    };

    onSubmit(payload);
    // parent (or hook) should handle closing on success; keep modal open until parent closes to allow error handling
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
            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-purple-700 text-white rounded-md text-sm font-medium hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Sending...
                </>
              ) : (
                "Share OTP"
              )}
            </button>
          </div>

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
};
export default PrePackageArrivalOTPModal;