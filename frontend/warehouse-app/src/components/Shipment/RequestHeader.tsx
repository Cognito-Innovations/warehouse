import React from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { formatDateTime } from "@/lib/utils";

interface RequestHeaderProps {
  request: {
    id: string;
    shipment_id: string;
    status: {
      label: string;
      value: string;
    };
    created_at: string;
    customer?: {
      name: string;
      email: string;
      suite_no: string;
    };
    country: {
      id: string;
      name: string;
    };
  };
  onDelete?: (id: string) => void;
}

const statusStyles: { [key: string]: string } = {
  "Ship Request": "bg-orange-100 text-orange-700 border border-orange-200",
  "Request Ship": "bg-orange-100 text-orange-700 border border-orange-200",
  "Payment Pending": "bg-purple-100 text-purple-700 border border-purple-200",
  "Payment Approved": "bg-green-100 text-green-700 border border-green-200",
  "Ready To Ship": "bg-blue-100 text-blue-700 border border-blue-200",
  "Departed": "bg-indigo-100 text-indigo-700 border border-indigo-200",
};

const RequestHeader: React.FC<RequestHeaderProps> = ({ request, onDelete }) => {
  const statusClassName =
    statusStyles[request.status.value] || "bg-gray-100 text-gray-700 border border-gray-200";

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-12 gap-y-2">
        <div>
          <p className="font-semibold text-gray-900">{request.shipment_id}</p>
          <p className="text-sm text-gray-500">
            {formatDateTime(request.created_at)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Request From</p>
          <p className="font-semibold text-gray-900">
            {request.country.name}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-md ${statusClassName}`}
          >
            {request.status.value}
          </span>
        </div>
      </div>

      {request.status.value === "REQUESTED" && (
        <button
          onClick={() => onDelete?.(request.id)}
          className="flex items-center gap-1.5 text-red-600 bg-red-50 rounded-md px-3 py-1.5 hover:bg-red-100 transition-colors duration-200"
        >
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
