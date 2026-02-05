"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { formatDateTime } from "@/lib/utils";
import { STATUS_ICONS } from "@/lib/shoppingRequestStatus";

interface ShoppingRequestCardMobileProps {
  request: any;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  NON_DELETABLE_STATUSES: string[];
}

const ShoppingRequestCardMobile: React.FC<ShoppingRequestCardMobileProps> = ({
  request,
  isSelected,
  onSelect,
  onDelete,
  NON_DELETABLE_STATUSES,
}) => {
  const router = useRouter();

  const statusMeta = STATUS_ICONS[request.status] || STATUS_ICONS.REQUESTED;
  const { Icon } = statusMeta;

  const isDeletable = !NON_DELETABLE_STATUSES.includes(
    request.status?.toUpperCase()
  );

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "ACTION REQUIRED" || s === "REQUESTED")
      return "text-orange-600 bg-orange-50";
    if (s === "ORDER_PLACED" || s === "COMPLETED")
      return "text-green-600 bg-green-50";
    if (s === "CANCELLED") return "text-red-600 bg-red-50";
    return "text-purple-600 bg-purple-50";
  };

  const handleCardClick = () => {
    router.push(
      `/assisted-shopping/${encodeURIComponent(request.request_code)}`
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-purple-50/50 border-purple-200"
          : "bg-white hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
            checked={isSelected}
            onChange={onSelect}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
              Request Code / ID
            </div>
            <div className="text-base font-bold text-gray-900 truncate flex items-center gap-2">
              {request.request_code}
            </div>
            <div className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
              {request.id}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
              Status
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${getStatusColor(
                request.status
              )} bg-opacity-50 font-bold`}
            >
              <Icon className="text-[14px]" />
              <span className="uppercase text-[10px] tracking-wider">
                {request.status?.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
              Details
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold text-gray-800">
                {request.items_count}{" "}
                {request.items_count === 1 ? "Item" : "Items"}
              </div>
              <div className="text-xs text-gray-500">
                {formatDateTime(request.created_at)}
              </div>
            </div>
          </div>

          {isDeletable && (
            <div
              className="pt-2 border-t border-gray-100 flex justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onDelete(request.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors text-xs font-medium flex items-center gap-1"
              >
                <DeleteIcon fontSize="small" />
                Delete Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingRequestCardMobile;