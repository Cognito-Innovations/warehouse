import React, { useEffect, useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary.api";
import { addPackagePaymentSlip } from "@/lib/api.service";
import { Loader } from "./Loader";
import { formatDateTime } from "@/lib/utils";

interface InvoiceRequest {
  status: {
    label: string;
    value: string;
  };
  shipment_uuid: string;
  invoice?: {
    invoice_no?: string;
    total?: number;
    created_at?: string;
  };
  documents?: {
    document_url: string;
  }[];
  charges: {
    amount: number;
  }[];
}

const PAID_STATUSES = ["Payment Approved", "Ready To Ship", "Departed"];

export default function Invoices({ request, payment_slips, onUpdate }: { request: InvoiceRequest, payment_slips: {document_url:string}[], onUpdate?: () => void; }) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const amount = request?.charges?.[0]?.amount || "No Amount";
  const isPaid = PAID_STATUSES.includes(request.status.value);

  useEffect(() => {
    if (payment_slips?.length) {
      setUploadedUrls(payment_slips.map((slip:{document_url:string}) => slip.document_url));
    } else {
      setUploadedUrls([]);
    }
  }, [payment_slips]);

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
          await addPackagePaymentSlip(request.shipment_uuid, {
            url,
            original_filename: file.name,
            mime_type: file.type,
            file_size: file.size,
          });
          setUploadedUrls((prev) => [...prev, url]);
          onUpdate?.();
        }
      }
    } catch (error) {
      console.error("Failed to upload:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Package Amount</p>
            <p className="text-sm text-gray-500"> {amount}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs rounded text-white ${
              isPaid ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {isPaid ? "Paid" : "Unpaid"}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-900">Payment Slips</p>
          <p className="text-sm text-gray-500 mb-2">Upload payment slips</p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex gap-3 flex-wrap">
            {uploadedUrls.map((url, index) => {
              const isImage = typeof url === "string" && url.match(/\.(jpeg|jpg|png|gif|webp)$/i);

              return (
                <div
                  key={index}
                  className="w-10 h-10 border rounded flex items-center justify-center text-xs text-gray-600 bg-gray-100 cursor-pointer"
                  onClick={() => window.open(url, "_blank")}
                >
                  {isImage ? (
                    <img
                      src={url}
                      alt={`Uploaded-${index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">📄</span>
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
        </div>
      </div>
    </>
  );
}