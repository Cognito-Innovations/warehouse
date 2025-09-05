import React from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { formatDateTime } from '@/lib/utils';

interface RequestHeaderProps {
  request: {
    id: string;
    created_at: string;
    items: number;
    status: string;
    country: string;
  };
}

const statusStyles: { [key: string]: string } = {
  REQUESTED: 'bg-orange-100 text-orange-700 border border-orange-200',
  QUOTATION_READY: 'bg-blue-100 text-blue-700 border border-blue-200',
  QUOTATION_CONFIRMED: 'bg-green-100 text-green-700 border border-green-200',
  INVOICED: 'bg-green-100 text-green-700 border border-green-200',
  PAYMENT_PENDING: 'bg-orange-100 text-orange-700 border border-orange-200',
  PAYMENT_APPROVED: 'bg-green-100 text-green-700 border border-green-200',
  ORDER_PLACED: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const RequestHeader: React.FC<RequestHeaderProps> = ({ request }) => {
  const statusClassName =
    statusStyles[request.status] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-12 gap-y-2">
        <div>
          <p className="font-semibold text-gray-900">{request.id}</p>
          <p className="text-sm text-gray-500">
            {formatDateTime(request.created_at)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Request From</p>
          <p className="font-semibold text-gray-900">{request.country}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">No. of Item</p>
          <p className="font-semibold text-gray-900">{request.items}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-md ${statusClassName}`}
          >
            {request.status}
          </span>
        </div>
      </div>

      {request.status === 'REQUESTED' && (
        <button className="flex items-center gap-1.5 text-red-600 bg-red-50 rounded-md px-3 py-1.5 hover:bg-red-100 transition-colors duration-200">
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