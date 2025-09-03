'use client';

import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

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

  const steps = [
    {
      number: 1,
      text: "Fill out the shopping request form. Always remember to specify the product variations (eg: Size, Color or other variations)"
    },
    {
      number: 2,
      text: "You will receive a quotation for the shopping request. Every quotation will be automatically cancelled within 5 days."
    },
    {
      number: 3,
      text: "Once you approve the quotation, an Invoice will be sent to settle the payment for the shopping request. If you fail to pay for the invoice within 48hrs, the invoice & the shopping request will be cancelled automatically."
    },
    {
      number: 4,
      text: "After the payment for your order is approved, our team will process the order and make the purchase on your behalf."
    },
    {
      number: 5,
      text: "We will log the items as they are received to your Shopme suite. You can also view the shopping request status & item's status from your assisted shopping request portal."
    },
    {
      number: 6,
      text: "When all of the items are received to your suite, create a shipping request to ship out your packages to final destination."
    }
  ];

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
              For help, call <span className="font-semibold">+9603344555</span> or Email to{' '}
              <span className="font-semibold text-purple-700">support@shopme.mv</span>
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link href="/assisted-shopping/create-request">
              <button
                onClick={onClose}
                className="bg-purple-700 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200"
              >
                Shopping Request
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;
