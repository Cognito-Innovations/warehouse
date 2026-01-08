import React from "react";
import { formatDateTime } from "@/lib/utils";
import { 
  HourglassEmpty as HourglassIcon, 
  CheckCircle as CheckIcon 
} from "@mui/icons-material";

interface ShareOtpCardMobileProps {
  data: any;
}

const ShareOtpCardMobile: React.FC<ShareOtpCardMobileProps> = ({ data }) => {
  const isPending = data.status === "pending";

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
              Tracking No
            </div>
            <div className="text-base font-bold text-gray-900 truncate">
              {data.tracking_no}
            </div>
          </div>
          
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold uppercase ${
            isPending ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
          }`}>
            {isPending ? (
              <HourglassIcon className="text-[14px]" />
            ) : (
              <CheckIcon className="text-[14px]" />
            )}
            <span>{data.status}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-500 uppercase">OTP Code</span>
          <span className="text-lg font-mono font-bold text-purple-600 tracking-wider">
            {data.otp}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <div className="text-[10px] text-gray-400">
            Created: {formatDateTime(data.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareOtpCardMobile;