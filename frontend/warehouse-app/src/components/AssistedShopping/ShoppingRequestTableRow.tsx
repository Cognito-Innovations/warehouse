import React from "react";
import Link from "next/link";
import { Delete as DeleteIcon, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { formatDateTime } from "@/lib/utils";
import { STATUS_ICONS } from "@/lib/shoppingRequestStatus";

interface ShoppingRequestTableRowProps {
  request: any;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
  NON_DELETABLE_STATUSES: string[];
}

const ShoppingRequestTableRow: React.FC<ShoppingRequestTableRowProps> = ({
  request,
  isSelected,
  onSelect,
  onDelete,
  NON_DELETABLE_STATUSES,
}) => {
  const statusMeta = STATUS_ICONS[request.status] || STATUS_ICONS.REQUESTED;
  const { Icon } = statusMeta;
  const isDeletable = !NON_DELETABLE_STATUSES.includes(request.status?.toUpperCase());

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s === "ACTION REQUIRED" || s === "REQUESTED") return "text-orange-600 bg-orange-50";
    if (s === "ORDER_PLACED" || s === "COMPLETED") return "text-green-600 bg-green-50";
    if (s === "CANCELLED") return "text-red-600 bg-red-50";
    return "text-purple-600 bg-purple-50";
  };

  return (
    <tr
      className={`group transition-colors duration-200 ${
        isSelected ? "bg-purple-50/50" : "hover:bg-gray-50/80"
      }`}
    >
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap w-4">
        <input
          type="checkbox"
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>

      <td className="px-4 sm:px-6 py-4">
        <div className="flex flex-col">
          <Link
            href={`/assisted-shopping/${encodeURIComponent(request.request_code)}`}
            className="text-sm font-bold text-gray-900 hover:text-purple-600 transition-colors cursor-pointer"
          >
            {request.request_code}
          </Link>
          <span className="text-[11px] text-gray-400 font-mono mt-0.5">
            {request.id}
          </span>
        </div>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${getStatusColor(
            request.status
          )} border border-transparent`}
        >
          <Icon sx={{ fontSize: 16 }} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {request.status?.replace(/_/g, " ")}
          </span>
        </div>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-700">
            {request.items_count} {request.items_count === 1 ? "Item" : "Items"}
          </span>
          <span className="text-xs text-gray-400">
            {formatDateTime(request.created_at)}
          </span>
        </div>
      </td>

      <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/assisted-shopping/${encodeURIComponent(request.request_code)}`}>
            <Tooltip title="View Details">
              <IconButton size="small" className="text-gray-400 hover:text-purple-600">
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
          </Link>

          {isDeletable && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(request.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ShoppingRequestTableRow;