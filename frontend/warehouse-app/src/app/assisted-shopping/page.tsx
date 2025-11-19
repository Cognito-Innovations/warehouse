"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import {
  ShoppingBag as ShoppingBagIcon,
  History as HistoryIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import { deleteShoppingRequest, getShoppingRequestsByUser } from "@/lib/api.service";
import TabPanel from "../../components/AssistedShopping/TabPanel";
import SearchBar from "../../components/AssistedShopping/SearchBar";
import EmptyState from "../../components/AssistedShopping/EmptyState";
import ShoppingRequestList from "../../components/AssistedShopping/ShoppingRequestList";
import RequestPagination from "../../components/AssistedShopping/RequestPagination";
import HowItWorksModal from "../../components/Modals/HowItWorksModal/HowItWorksModal";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";

export default function AssistedShopping() {
  const { data: session, status } = useSession();
  
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHowItWorksModalOpen, setIsHowItWorksModalOpen] = useState(false);
  const [shoppingRequests, setShoppingRequests] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const user_id = (session?.user as any)?.user_id;

  const fetchRequests = async () => {
    if (!user_id) return;

    setIsLoading(true);
    try {
      const data = await getShoppingRequestsByUser(user_id);
      setShoppingRequests(data);
    } catch (error) {
      console.error("Error fetching shopping requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && user_id) {
      fetchRequests();
    }
  }, [user_id, status]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setSearchTerm("");
  };

  const handleNewShoppingRequest = () => {
    setIsHowItWorksModalOpen(true);
  };

  const handleDeleteClick = (requestId: string) => {
    setDeleteId(requestId);
    setConfirmOpen(true);
  };

  const handleDeleteRequest = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      await deleteShoppingRequest(deleteId);
      setShoppingRequests((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success("Shopping request deleted successfully!");
    } catch (error) {
      console.error("Error deleting shopping request:", error);
      toast.error("Failed to delete request", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg min-h-[400px]">
          <TabPanel value={value} index={0}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  <SearchBar
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                  />
                </div>
                <button
                  onClick={handleNewShoppingRequest}
                  className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <AddIcon className="w-4 h-4" />
                  Shopping Request
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center">
                  <CircularProgress />
                </div>
              ) : shoppingRequests.length > 0 ? (
                <>
                  <ShoppingRequestList
                    shoppingRequests={shoppingRequests}
                    searchTerm={searchTerm}
                    onDeleteClick={handleDeleteClick}
                  />

                  <RequestPagination count={shoppingRequests.length} />
                </>
              ) : (
                <EmptyState
                  icon={<ShoppingBagIcon />}
                  message="No Shopping Requests Available"
                />
              )}
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className="p-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
              />
              <EmptyState
                icon={<HistoryIcon />}
                message="No History Available"
              />
            </div>
          </TabPanel>
        </div>

        <HowItWorksModal
          isOpen={isHowItWorksModalOpen}
          onClose={() => setIsHowItWorksModalOpen(false)}
        />

        <ConfirmDialog
          open={confirmOpen}
          title="Delete Request"
          message="Are you sure you want to delete this shopping request? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteRequest}
          onClose={() => setConfirmOpen(false)}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
