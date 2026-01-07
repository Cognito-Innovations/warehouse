"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";
import { toast } from "sonner";

import usePreArrival from "@/hooks/usePreArrival";
import { useAuth } from "@/contexts/AuthContext";
import { getPreArrivalsByUser, deletePreArrival } from "@/lib/api.service";
import EmptyState from "../Tabs/EmptyState";
import SearchAndFilter from "../Tabs/SearchAndFilter";
import PrePackageArrivalOTPModal from "../Modals/PrePackageArrivalOTPModal/PrePackageArrivalOTPModal";
import PreArrivalPopup from "../Modals/PrePackageArrivalOTPModal/PreArrivalPopup";
import ShareOtpHeader from "./ShareOTP/ShareOtpHeader";
import ShareOtpCardMobile from "./ShareOTP/ShareOtpCardMobile";
import ShareOtpTableRow from "./ShareOTP/ShareOtpTableRow";
import { formatDateTime } from "@/lib/utils";

const ShareOtpContent = () => {
  const { user } = useAuth();

  const { submitPreArrival, loading: submitting } = usePreArrival({
    userId: user?.id,
  });
  
  const [preArrivalHistory, setPreArrivalHistory] = useState<any[]>([]);
  const [preArrivalLoading, setPreArrivalLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isPreArrivalPopupOpen, setIsPreArrivalPopupOpen] = useState(false);
  const [newPreArrival, setNewPreArrival] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchPreArrivals = useCallback(async () => {
    if (!user?.id) return;
    setPreArrivalLoading(true);
    try {
      const data = await getPreArrivalsByUser(user.id);
      setPreArrivalHistory(data);
    } catch (err) {
      toast.error("Failed to fetch OTP history");
    } finally {
      setPreArrivalLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPreArrivals();
  }, [fetchPreArrivals]);

  const filteredHistory = preArrivalHistory.filter((item) =>
    !searchTerm || item.tracking_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShareOTPClick = () => {
    setFormErrors({});
    setIsOTPModalOpen(true);
  };

  const handleOTPModalClose = () => {
    setIsOTPModalOpen(false);
  };

  const handleOTPSubmit = async (data: any) => {
    setFormErrors({});
    try {
      const createdOTP = await submitPreArrival(data);
      setNewPreArrival(createdOTP);
      setIsPreArrivalPopupOpen(true);
      setIsOTPModalOpen(false);
      toast.success("OTP sent successfully!");
      fetchPreArrivals();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        const errorMessage = err.response.data.message;
        const parsedErrors: Record<string, string> = {};

        const errorParts = errorMessage.split(", ");
        errorParts.forEach((part: string) => {
          if (part.toLowerCase().includes("otp")) {
            parsedErrors.otp = part;
          }
          if (part.toLowerCase().includes("tracking number")) {
            parsedErrors.trackingNumber = part;
          }
        });
        
        setFormErrors(parsedErrors);
      } else {
        toast.error("Failed to send OTP", {
          description: err.message || "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const handleCreateNewFromPopup = () => {
    setIsPreArrivalPopupOpen(false);
    setIsOTPModalOpen(true); 
  };

  const handleDeletePreArrival = async () => {
    if (!newPreArrival?.id) return;
    setIsDeleting(true);

    try {
      await deletePreArrival(newPreArrival.id);
      toast.success("Pre-arrival deleted successfully!");
      setIsPreArrivalPopupOpen(false);
      fetchPreArrivals();
    } catch (err) {
      toast.error("Failed to delete pre-arrival", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white border border-gray-200 rounded-lg shadow-sm">
      <ShareOtpHeader onShareOTP={handleShareOTPClick}>
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search tracking no..."
          showFilter={false}
        />
      </ShareOtpHeader>

      <div className="md:hidden max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 p-4 space-y-3">
        {preArrivalLoading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress size={32} className="text-purple-600" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-12">
            <EmptyState icon={<HistoryIcon />} message="No OTP History Available" />
          </div>
        ) : (
          filteredHistory.map((item) => (
            <ShareOtpCardMobile key={item.id} data={item} />
          ))
        )}
      </div>

      <div className="hidden md:block overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
          <thead className="bg-gray-50/95 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Tracking No
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                OTP Code
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {preArrivalLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <CircularProgress size={32} className="text-purple-600" />
                </td>
              </tr>
            ) : filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <EmptyState icon={<HistoryIcon />} message="No OTP History Available" />
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <ShareOtpTableRow key={item.id} data={item} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <PrePackageArrivalOTPModal 
        isOpen={isOTPModalOpen} 
        onClose={handleOTPModalClose} 
        onSubmit={handleOTPSubmit}
        isLoading={submitting}
        errors={formErrors}
      />

      <PreArrivalPopup
        isOpen={isPreArrivalPopupOpen}
        onClose={() => setIsPreArrivalPopupOpen(false)}
        onDelete={handleDeletePreArrival}
        onCreateNew={handleCreateNewFromPopup}
        preArrivalData={newPreArrival ? {
          otp: newPreArrival.otp,
          eta: newPreArrival.estimate_arrival_time,
          trackingNo: newPreArrival.tracking_no,
          requestedAt: formatDateTime(newPreArrival.created_at),
          status: newPreArrival.status,
          details: newPreArrival.details || "NOTHING"
        } : null}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ShareOtpContent;