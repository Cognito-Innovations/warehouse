import React, { ReactNode } from "react";

interface ShareOtpHeaderProps {
  onShareOTP: () => void;
  children?: ReactNode;
}

const ShareOtpHeader: React.FC<ShareOtpHeaderProps> = ({ onShareOTP, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-100 gap-4">
      <div className="w-full md:w-auto order-2 md:order-1">
        {children}
      </div>

      <div className="flex items-center shrink-0 order-1 md:order-2">
        <button
          onClick={onShareOTP}
          className="inline-flex bg-purple-600 hover:bg-purple-700 text-white items-center justify-center px-4 py-2 transition-all ease-in-out border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none whitespace-nowrap"
        >
          Share OTP
        </button>
      </div>
    </div>
  );
};

export default ShareOtpHeader;