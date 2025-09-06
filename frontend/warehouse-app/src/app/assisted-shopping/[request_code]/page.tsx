'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';

import { getShoppingRequestById } from '@/lib/api.service';

import TrackingStatus from '@/components/AssistedShopping/TrackingStatus';
import RequestHeader from '@/components/AssistedShopping/RequestHeader';
import InfoBanner from '@/components/AssistedShopping/InfoBanner';
import ItemsList from '@/components/AssistedShopping/ItemsList';
import ActionsCard from '@/components/AssistedShopping/ActionsCard';
import QuotationItems from '@/components/AssistedShopping/QuotationItems';
import QuotationSummary from '@/components/AssistedShopping/QuotationSummary';
import { shoppingRequestMessages } from '@/lib/shoppingRequestMessages';
import Invoices from '@/components/AssistedShopping/Invoices';

export default function ViewShoppingRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { request_code } = params;

  const [request, setRequest] = useState<any>(null);
  const [selectedForQuote, setSelectedForQuote] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const handleSelectionChange = useCallback((selected: any[]) => {
    setSelectedForQuote(selected);
  }, []);

  const isQuotation = request?.status === 'QUOTATION_READY';
  const isQuotationConfirmed = request?.status === 'QUOTATION_CONFIRMED';
  const isInvoiced = request?.status === 'INVOICED';
  const isPaymentPending = request?.status === 'PAYMENT_PENDING';
  const isPaymentApproved = request?.status === 'PAYMENT_APPROVED';
  const isOrderPlaced = request?.status === "ORDER_PLACED";

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const data = await getShoppingRequestById(request_code as string);
      setRequest(data);
    } catch (error) {
      console.error("Failed to fetch shopping request:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (request_code) {
      fetchRequest();
    }
  }, [request_code]);

   useEffect(() => {
    if (isQuotation && request?.shopping_request_products) {
      setSelectedForQuote(request.shopping_request_products);
    }
  }, [isQuotation, request]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <CircularProgress />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-10 bg-gray-50 min-h-screen">
        <p className="text-lg text-gray-700">Request not found.</p>
        <button onClick={() => router.push('/assisted-shopping')} className="mt-4 text-purple-600 hover:underline">
          Back to Shopping Requests
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <p className="text-sm text-gray-500 mb-4">
          <Link href="/assisted-shopping" className="text-purple-600 hover:underline">
            Shopping Requests
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-700">View Request</span>
        </p>

        <div className="mb-6">
          <RequestHeader request={request} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[320px] lg:flex-shrink-0">
            <TrackingStatus
              currentStatus={request.status}
              createdAt={request.created_at}
            />
          </div>

          <div className="w-full lg:flex-1 space-y-6">
            <InfoBanner message={shoppingRequestMessages[request.status] || "No updates available."} />
            {isQuotation || isQuotationConfirmed || isInvoiced || isPaymentPending || isPaymentApproved || isOrderPlaced ? (
              <>
                {(isInvoiced || isPaymentPending || isPaymentApproved || isOrderPlaced) && (
                  <Invoices invoice={request} onUpdate={fetchRequest}/>
                )}

                <QuotationItems
                  items={request.shopping_request_products || []}
                  onSelectionChange={handleSelectionChange}
                />
                <QuotationSummary
                  items={selectedForQuote || []}
                  requestId={request.id}
                  showConfirmButton={!isQuotationConfirmed && !isInvoiced && !isPaymentPending && !isPaymentApproved && !isOrderPlaced}
                  onStatusUpdated={fetchRequest}
                />
              </>
            ) : (
              <>
                <ItemsList items={request.shopping_request_products || []} />
                {!isQuotationConfirmed && !isInvoiced && <ActionsCard />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}