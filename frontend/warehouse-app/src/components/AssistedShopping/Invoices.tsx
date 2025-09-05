import React, { useEffect, useRef, useState } from "react";
import { InvoiceModal } from "./InvoiceModal";
import { uploadToCloudinary } from "@/lib/cloudinary.api";
import { addPaymentSlip, updateShoppingRequestStatus } from "@/lib/api.service";
import { Loader } from "./Loader";
import { formatDateTime } from "@/lib/utils";

export default function Invoices({ invoice, onUpdate }: { invoice: any, onUpdate?: () => void; }) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const number = invoice?.number || "No Invoice Number";
  const amount = invoice?.amount ? `USD ${invoice.amount}` : "No Amount";
  const date = invoice?.date ? formatDateTime(invoice.date) : "No Date";

  const isPaid = ["PAYMENT_APPROVED", "ORDER_PLACED"].includes(invoice.status);

  useEffect(() => {
    if (invoice?.payment_slips?.length) {
      setUploadedUrls(invoice.payment_slips);
    }
  }, [invoice]);

  const handleFileClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    setUploading(true);
    const filesArray = Array.from(e.target.files);

    try {
      for (const file of filesArray) {
        const url = await uploadToCloudinary(file);
        if (url) {
          setUploadedUrls((prev) => [...prev, url]);
          await addPaymentSlip(invoice.id, url);
          onUpdate?.();
        }
      }
    } catch (error) {
      console.error("FAiled to upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (uploadedUrls.length === 0 || uploading) return;

    setConfirming(true);
    try {
      await updateShoppingRequestStatus(invoice.id, "PAYMENT_PENDING");
      onUpdate?.();
    } catch (error) {
      console.error("Failed to confirm:", error);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{number}</p>
            <p className="text-sm text-gray-500">USD {amount}</p>
          </div>
          <p className="text-sm text-gray-500">{formatDateTime(date)}</p>
          <span
            className={`px-2 py-1 text-xs rounded text-white ${
              isPaid ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {isPaid ? "Paid" : "Unpaid"}
          </span>
          <button 
            className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
             onClick={() => setShowModal(true)}
          >
            View
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-900">Payment Slips</p>
          <p className="text-sm text-gray-500 mb-2">Upload payment slips</p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex gap-3 flex-wrap">
            {uploadedUrls.map((url, index) => {
              const isImage = url.match(/\.(jpeg|jpg|png|gif|webp)$/i);

              return (
              <div
                key={index}
                className="w-10 h-10 border rounded flex items-center justify-center text-xs text-gray-600 bg-gray-100"
                onClick={() => window.open(url, "_blank")}
              >
                {isImage ? (
                  <img
                    src={url}
                    alt={`Uploaded-${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs">📄</span>
                )}
              </div>
            );
            })}

            <div
              className={`w-10 h-10 border rounded flex items-center justify-center ${
                uploading
                  ? "text-blue-500"
                  : "text-gray-400 hover:bg-gray-50 cursor-pointer"
              }`}
              onClick={handleFileClick}
            >
              {uploading ? <Loader size={20} /> : <span className="text-2xl">＋</span>}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>

          {invoice.status === "INVOICED" && (
            <div className="flex justify-end mt-3">
              <button
                onClick={handleConfirm}
                disabled={uploadedUrls.length === 0 || uploading || confirming}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  uploadedUrls.length === 0 || uploading || confirming
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {confirming ? <Loader size={18} color="text-white" /> : "Confirm"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && <InvoiceModal onClose={() => setShowModal(false)} />}
    </>
  );
}