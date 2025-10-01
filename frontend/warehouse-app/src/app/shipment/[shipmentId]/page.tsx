"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { getPackagesByShipmentId, getPaymentSlips } from "@/lib/api.service";
import { toast } from "sonner";

import TrackingStatus from "@/components/Shipment/TrackingStatus";
import RequestHeader from "@/components/Shipment/RequestHeader";
import ActionsCard from "@/components/Shipment/ActionsCard";
import Invoices from "@/components/Shipment/Invoices";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";

interface IShipmentRequest {
  id: string;
  shipment_id: string;
  shipment_uuid: string;
  country: {
    id: string;
    name: string;
  };
  charges:{
    amount: number;
  }[];
  status: {
    label: string;
    value: string;
  };
  created_at: string;
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const shipmentId = Array.isArray(params.shipmentId) ? params.shipmentId[0] : params.shipmentId;

  const [request, setRequest] = useState<IShipmentRequest | null>(null);
  const [paymentSlips, setPaymentSlips] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequest = useCallback(async () => {
    if (!shipmentId) return;

    setLoading(true);
    try {
      const data = await getPackagesByShipmentId(shipmentId);
      if (data && data.length > 0) {
        setRequest(data[0]);
      } else {
        setRequest(null);
        toast.warning("Shipment request not found.");
      }
    } catch (error) {
      console.error("Failed to fetch shipment package:", error);
      toast.error("Failed to fetch shipment package.");
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [shipmentId]);

  const fetchPaymentSlips = useCallback(async (shipment_uuid: string) => {
    try {
      const slips = await getPaymentSlips(shipment_uuid);
      setPaymentSlips(slips);
    } catch (err) {
      console.error("Failed to fetch payment slips:", err);
      toast.error("Failed to load payment slips.");
    }
  }, []);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  useEffect(() => {
    if (request?.shipment_uuid) {
      fetchPaymentSlips(request.shipment_uuid);
    }
  }, [request, fetchPaymentSlips]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      toast.success("Request deleted successfully!");
      router.push("/dashboard?tab=shipments");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete request");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
      setIsDeleting(false);
    }
  }, [deleteId, router]);

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const displayInvoiceSection = request && ["Payment Pending", "Payment Approved", "Ready To Ship", "Departed"].includes(request.status.value);

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
        <Link href='/dashboard?tab=shipments' className="mt-4 inline-block text-purple-600 hover:underline">
          Back to Shipping Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <p className="text-sm text-gray-500 mb-4">
          <Link href='/dashboard?tab=shipments' className="text-purple-600 hover:underline">
            Shipping Requests
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-700">View Request</span>
        </p>

        <div className="mb-6">
          <RequestHeader
            request={request}
            onDelete={openDeleteDialog}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[320px] lg:flex-shrink-0">
            <TrackingStatus
              status={request.status.value}
              createdAt={request.created_at}
            />
          </div>

          <div className="w-full lg:flex-1 space-y-6">
            {displayInvoiceSection && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Note:</span> The charges shown below include packing and shipping costs for your shipment.
                  </p>
                </div>
                <Invoices request={request} payment_slips={paymentSlips} onUpdate={fetchRequest} />
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
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}