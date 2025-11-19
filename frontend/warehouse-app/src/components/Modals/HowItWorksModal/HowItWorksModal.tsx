"use client";

import React from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { steps } from "@/utils/constants";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">How does it work?</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Steps */}
          <div className="space-y-4 mb-6">
            {steps.map((step) => (
              <div key={step.number} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {step.number}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              For help, Email to{" "}
              <span className="font-semibold text-purple-700">support@palakart.com</span>
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link 
              href="/assisted-shopping/create-request"
              className="bg-purple-700 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200 inline-block"
              onClick={onClose}
            >
              Shopping Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;
