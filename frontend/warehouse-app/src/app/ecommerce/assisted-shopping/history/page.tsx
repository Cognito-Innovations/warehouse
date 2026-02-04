"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import { ShoppingBag as ShoppingBagIcon } from "@mui/icons-material";

import { deleteShoppingRequest, getShoppingRequestsByUser } from "@/lib/api.service";

import ConfirmDialog from "@/components/Modals/ConfirmDialog";
import SearchBar from "@/components/AssistedShopping/SearchBar";
import EmptyState from "@/components/AssistedShopping/EmptyState";
import RequestPagination from "@/components/AssistedShopping/RequestPagination";
import ShoppingRequestTableRow from "@/components/AssistedShopping/ShoppingRequestTableRow";
import ShoppingRequestCardMobile from "@/components/AssistedShopping/ShoppingRequestCardMobile";
import { ROUTES } from "@/utils/constants";

export default function AssistedShopping() {
  const { data: session, status } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [shoppingRequests, setShoppingRequests] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);

  const user_id = (session?.user as any)?.user_id;
  const NON_DELETABLE_STATUSES = ["PAYMENT_APPROVED", "ORDER_PLACED"];

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
      setSelectedRequestIds((prev) => prev.filter((id) => id !== deleteId));
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

  const toggleSelection = (id: string) => {
    setSelectedRequestIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (filteredItems: any[]) => {
    if (selectedRequestIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedRequestIds([]);
    } else {
      setSelectedRequestIds(filteredItems.map((item) => item.id));
    }
  };

  const filteredRequests = shoppingRequests.filter((request) => {
    if (!request.request_code) return false;
    return request.request_code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    if(!user_id && typeof window !== "undefined") {
     window.location.href = ROUTES.SIGN_IN;
    }
 }, [user_id]);

  return (
    <div className="min-h-screen bg-white w-full"> 
      <div className="w-full px-4 py-4 border-b border-gray-100">
        <div className="max-w-md">
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
        </div>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <CircularProgress size={32} className="text-purple-600" />
          </div>
        ) : filteredRequests.length > 0 ? (
          <>
            <div className="md:hidden p-4 space-y-3">
              {filteredRequests.map((request) => (
                <ShoppingRequestCardMobile
                  key={request.id}
                  request={request}
                  isSelected={selectedRequestIds.includes(request.id)}
                  onSelect={() => toggleSelection(request.id)}
                  onDelete={handleDeleteClick}
                  NON_DELETABLE_STATUSES={NON_DELETABLE_STATUSES}
                />
              ))}
            </div>

            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full table-fixed border-separate border-spacing-0">
                <thead className="bg-gray-50/95">
                  <tr>
                    <th scope="col" className="w-12 pl-4 py-4 text-left border-b border-gray-200">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                        checked={
                          filteredRequests.length > 0 &&
                          selectedRequestIds.length === filteredRequests.length
                        }
                        onChange={() => toggleSelectAll(filteredRequests)}
                      />
                    </th>
                    <th scope="col" className="w-[35%] px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Request Code / ID
                    </th>
                    <th scope="col" className="w-[20%] px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Status
                    </th>
                    <th scope="col" className="w-[20%] px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Items / Date
                    </th>
                    <th scope="col" className="w-[15%] pr-4 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredRequests.map((request) => (
                    <ShoppingRequestTableRow
                      key={request.id}
                      request={request}
                      isSelected={selectedRequestIds.includes(request.id)}
                      onSelect={() => toggleSelection(request.id)}
                      onDelete={handleDeleteClick}
                      NON_DELETABLE_STATUSES={NON_DELETABLE_STATUSES}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100">
              <RequestPagination count={filteredRequests.length} />
            </div>
          </>
        ) : (
          <div className="py-12">
            <EmptyState
              icon={<ShoppingBagIcon style={{ fontSize: 40 }} />}
              message="No Shopping Requests Found"
            />
          </div>
        )}
      </div>

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
  );
}