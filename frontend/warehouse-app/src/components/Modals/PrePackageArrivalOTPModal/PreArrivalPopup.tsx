import React from "react";
import { X as CloseIcon } from "lucide-react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

interface PreArrivalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onCreateNew: () => void;
  preArrivalData: {
    otp: string | number;
    eta?: string;
    trackingNo?: string;
    requestedAt?: string;
    status?: "pending" | "received";
    details: string;
  } | null;
  isDeleting?: boolean;
}

const PreArrivalPopup: React.FC<PreArrivalPopupProps> = ({
  isOpen,
  onClose,
  onDelete,
  onCreateNew,
  preArrivalData,
  isDeleting,
}) => {
  if (!isOpen || !preArrivalData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative p-5">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <h3 className="text-base font-semibold text-gray-900">
            Pre Package Arrival OTP
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <button
              onClick={onCreateNew}
              className="bg-[#8B3DFF] hover:bg-[#752ee0] text-white text-sm font-semibold py-2 px-4 rounded-md mb-6 transition-colors"
            >
              Create New
            </button>

            <div className="space-y-2 text-sm leading-6">
              <div className="flex">
                <span className="text-gray-600 font-medium w-[130px]">OTP:</span>
                <span className="font-semibold text-gray-900">{preArrivalData.otp}</span>
              </div>

              {preArrivalData.eta && (
                <div className="flex">
                  <span className="text-gray-600 font-medium w-[130px]">ETA:</span>
                  <span className="text-gray-900">{preArrivalData.eta}</span>
                </div>
              )}

              <div className="flex">
                <span className="text-gray-600 font-medium w-[130px]">
                  Tracking / Order No.:
                </span>
                <span className="text-gray-900">
                  {preArrivalData.trackingNo || "1236478"}
                </span>
              </div>

              {preArrivalData.requestedAt && (
                <div className="flex">
                  <span className="text-gray-600 font-medium w-[130px]">
                    Requested At:
                  </span>
                  <span className="text-gray-900">{preArrivalData.requestedAt}</span>
                </div>
              )}

              <div className="text-gray-500 italic mt-3">{preArrivalData.details}</div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
              Pending
            </span>

            <button
              onClick={onDelete}
              disabled={isDeleting}
              className={`flex items-center gap-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${
                isDeleting
                  ? "bg-red-100 text-red-400 cursor-not-allowed"
                  : "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                }`
              }
            >
                {isDeleting ? (
                    <div className="flex items-center gap-2">
                        <CircularProgress size={20} color="inherit" />
                        Deleting...
                    </div>
                ): (
                    <div className="flex items-center gap-2">
                        <DeleteIcon sx={{ fontSize: 18 }} />
                        Delete
                    </div>
                )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreArrivalPopup;
