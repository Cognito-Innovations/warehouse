"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CircularProgress } from "@mui/material";

import { deleteShoppingRequest, getShoppingRequestById } from "@/lib/api.service";

import TrackingStatus from "@/components/AssistedShopping/TrackingStatus";
import RequestHeader from "@/components/AssistedShopping/RequestHeader";
import InfoBanner from "@/components/AssistedShopping/InfoBanner";
import ItemsList from "@/components/AssistedShopping/ItemsList";
import ActionsCard from "@/components/AssistedShopping/ActionsCard";
import QuotationItems from "@/components/AssistedShopping/QuotationItems";
import QuotationSummary from "@/components/AssistedShopping/QuotationSummary";
import { shoppingRequestMessages } from "@/lib/shoppingRequestStatus";
import Invoices from "@/components/AssistedShopping/Invoices";
import { toast } from "sonner";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";

export default function ViewShoppingRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { request_code } = params;

  const [request, setRequest] = useState<any>(null);
  const [selectedForQuote, setSelectedForQuote] = useState<any[]>([]); 
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectionChange = useCallback((selected: any[]) => {
    setSelectedForQuote(selected);
  }, []);

  const isQuotation = request?.status === "QUOTATION_READY";
  const isQuotationConfirmed = request?.status === "QUOTATION_CONFIRMED";
  const isInvoiced = request?.status === "INVOICED";
  const isPaymentPending = request?.status === "PAYMENT_PENDING";
  const isPaymentApproved = request?.status === "PAYMENT_APPROVED";
  const isOrderPlaced = request?.status === "ORDER_PLACED";

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const data = await getShoppingRequestById(request_code as string);
      setRequest(data);
    } catch (error) {
      console.error("Failed to fetch shopping request:", error);
      toast.error("Failed to fetch shopping request");
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

   const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteShoppingRequest(id);
      toast.success("Request deleted successfully!");
      router.push("/assisted-shopping");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete request");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

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
        <button onClick={() => router.push("/assisted-shopping")} className="mt-4 text-purple-600 hover:underline">
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
          <RequestHeader
            request={request}
            onDelete={(id) => {
              setDeleteId(id);
              setConfirmOpen(true);
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[320px] lg:flex-shrink-0">
            <TrackingStatus
              trackingRequests={request.tracking_requests || []}
              createdAt={request.created_at}
            />
          </div>

          <div className="w-full lg:flex-1 space-y-6">
            <InfoBanner message={shoppingRequestMessages[request.status] || "No updates available."} />
            {isQuotation || isQuotationConfirmed || isInvoiced || isPaymentPending || isPaymentApproved || isOrderPlaced ? (
              <>
                {(isInvoiced || isPaymentPending || isPaymentApproved || isOrderPlaced) && (
                  <Invoices request={request} onUpdate={fetchRequest}/>
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

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Request"
        message="Are you sure you want to delete this request? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onClose={() => setConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}