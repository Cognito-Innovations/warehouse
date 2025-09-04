import { updateShoppingRequestStatus } from '@/lib/api.service';
import React, { useState } from 'react';

const COMMISSION_RATE = 0.08;
const GST_RATE = 0.08;

type Item = { id: string; quantity: number; unit_price?: number | null };

export default function QuotationSummary({
  items,
  requestId,
  showConfirmButton = true,
  onStatusUpdated
}: {
  items: Item[];
  requestId: string;
  showConfirmButton?: boolean;
   onStatusUpdated?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const subTotal = items.reduce(
    (sum, i) => sum + Number(i.quantity || 0) * Number(i.unit_price || 0),
    0
  );
  const commission = subTotal * COMMISSION_RATE;
  const gst = subTotal * GST_RATE;
  const total = subTotal + commission + gst;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await updateShoppingRequestStatus(requestId, 'INVOICED'); //TODO: For now using INVOICED instead of 'QUOTATION_CONFIRMED'
      onStatusUpdated?.();
    } catch (err) {
      console.error('Failed to confirm quotation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4 w-full lg:w-[300px] ml-auto">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-500">SubTotal:</span>
        <span className="font-semibold">${subTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-500">Commission (8%):</span>
        <span className="font-semibold">${commission.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-500">GST (8%):</span>
        <span className="font-semibold">${gst.toFixed(2)}</span>
      </div>
      <div className="border-t border-gray-200 my-2" />
      <div className="flex justify-between font-bold text-gray-900 text-base">
        <span>Total (MVR):</span>
        <span>{total.toFixed(2)}</span>
      </div>

      {showConfirmButton && (
        <button
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Confirming...' : `Confirm Quotation For ${items.length} Items`}
        </button>
      )}
    </div>
  );
}