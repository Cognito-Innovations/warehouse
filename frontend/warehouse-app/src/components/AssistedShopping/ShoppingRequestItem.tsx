"use client";
import React from "react";
import Link from "next/link";
import { Delete as DeleteIcon } from "@mui/icons-material";

import { formatDateTime } from "@/lib/utils";
import { STATUS_ICONS } from "@/lib/shoppingRequestStatus";

interface ShoppingRequestItemProps {
  request: any;
  onDeleteClick: (id: string) => void;
  NON_DELETABLE_STATUSES: string[];
}

export default function ShoppingRequestItem({
  request,
  onDeleteClick,
  NON_DELETABLE_STATUSES,
}: ShoppingRequestItemProps) {
  
  const statusMeta = STATUS_ICONS[request.status] || STATUS_ICONS.REQUESTED;
  const { Icon } = statusMeta;

  if (!request?.request_code) {
    return null;
  }

  return (
    <Link
      href={`/assisted-shopping/${encodeURIComponent(request.request_code)}`}
      className="block transition-all duration-200 hover:shadow-md hover:border-purple-200 rounded-lg"
    >
      <div
        key={request.id}
        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-6">
          <div>
            <p className="font-semibold text-gray-900">
              {request.request_code || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              {formatDateTime(request.created_at)}
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <p className="text-sm text-gray-600">
              {request.items_count}{" "}
              {request.items_count === 1 ? "Item" : "Items"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{request.status}</span>
          </div>

          {!NON_DELETABLE_STATUSES.includes(request.status.toUpperCase()) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onDeleteClick(request.id);
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <DeleteIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}