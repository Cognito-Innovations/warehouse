import React from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { formatDateTime } from "@/lib/utils";

interface Country {
  id: string;
  code: string;
  name: string;
  image: string;
  phone_code: string;
}

interface Courier {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  country: Country;
  is_active: boolean;
}

interface TrackingRequest {
  id: string;
  courier: Courier;
  status: string;
  feature_type: string;
  feature_fid: string;
  created_at: string;
  updated_at: string;
}

interface Request {
  id: string;
  request_code: string;
  created_at: string;
  items_count: number;
  status: string;
  tracking_requests: TrackingRequest[];
}

interface RequestHeaderProps {
  request: Request;
  onDelete?: (id: string) => void;
}

const statusStyles: { [key: string]: string } = {
  REQUESTED: "bg-orange-100 text-orange-700 border border-orange-200",
  QUOTATION_READY: "bg-blue-100 text-blue-700 border border-blue-200",
  QUOTATION_CONFIRMED: "bg-green-100 text-green-700 border border-green-200",
  INVOICED: "bg-green-100 text-green-700 border border-green-200",
  PAYMENT_PENDING: "bg-orange-100 text-orange-700 border border-orange-200",
  PAYMENT_APPROVED: "bg-green-100 text-green-700 border border-green-200",
  ORDER_PLACED: "bg-blue-100 text-blue-700 border border-blue-200",
};

const RequestHeader: React.FC<RequestHeaderProps> = ({ request, onDelete }) => {
  const statusClassName =
    statusStyles[request.status.toUpperCase()] || "bg-gray-100 text-gray-700";

  const countryName =
    request.tracking_requests?.[0]?.courier?.country?.name;

  const NON_DELETABLE_STATUSES = ["PAYMENT_APPROVED", "ORDER_PLACED"];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-12 gap-y-2">
        <div>
          <p className="font-semibold text-gray-900">{request.request_code}</p>
          <p className="text-sm text-gray-500">
            {formatDateTime(request.created_at)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Request From</p>
          <p className="font-semibold text-gray-900">{countryName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">No. of Item</p>
          <p className="font-semibold text-gray-900">{request.items_count}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-md ${statusClassName}`}
          >
            {request.status.toUpperCase()}
          </span>
        </div>
      </div>

      {!NON_DELETABLE_STATUSES.includes(request.status.toUpperCase()) && (
        <button
          onClick={() => onDelete?.(request.id)} 
          className="flex items-center gap-1.5 text-red-600 bg-red-50 rounded-md px-3 py-1.5 hover:bg-red-100 transition-colors duration-200">
          <DeleteIcon sx={{ fontSize: 18 }} />
          <span className="text-sm font-medium whitespace-nowrap">
            Delete Request
          </span>
        </button>
      )}
    </div>
  );
};

export default RequestHeader;