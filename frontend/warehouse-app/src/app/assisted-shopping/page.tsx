"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag as ShoppingBagIcon, History as HistoryIcon, Search as SearchIcon, Add as AddIcon, Delete as DeleteIcon, HourglassEmpty as HourglassIcon } from "@mui/icons-material";
import HowItWorksModal from "../../components/Modals/HowItWorksModal/HowItWorksModal";
import { deleteShoppingRequest, getShoppingRequestsByUser } from "@/lib/api.service";
import { useSession } from "next-auth/react";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";
import { STATUS_ICONS } from "@/lib/shoppingRequestStatus"; 

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div className="p-6">{children}</div>}
    </div>
  );
}

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
    if (!user_id || status === "loading") return; 
    fetchRequests();
  }, []);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setSearchTerm("");
  };

  const handleNewShoppingRequest = () => {
    setIsHowItWorksModalOpen(true);
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      await deleteShoppingRequest(requestId);
      setShoppingRequests((prev) => prev.filter((r) => r.id !== requestId));
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

  const NON_DELETABLE_STATUSES = ["PAYMENT_APPROVED", "ORDER_PLACED"];

  const renderSearchBar = () => (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by package id"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
      />
    </div>
  );

  const renderEmptyState = (icon: React.ReactNode, message: string) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
      <div className="text-6xl text-gray-300 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-600">{message}</h3>
    </div>
  );

  const renderShoppingRequests = () => {
    const filteredRequests = shoppingRequests.filter((request) => {
    if (!request.shopping_request_products || request.shopping_request_products.length === 0) {
      return false;
    }

    return request.shopping_request_products.some((product: {name: string}) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

    if (filteredRequests.length === 0) {
      return renderEmptyState(<ShoppingBagIcon />, "No matching requests found");
    }

    return (
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const statusMeta = STATUS_ICONS[request.status] || STATUS_ICONS.REQUESTED;
          const { Icon } = statusMeta;

          // Skip requests without valid request_code during build
          if (!request?.request_code) {
            return null;
          }

          return (
            <Link 
              href={`/assisted-shopping/${encodeURIComponent(request.request_code)}`} 
              key={request.request_code}
              className="block transition-all duration-200 hover:shadow-md hover:border-purple-200 rounded-lg"
            >
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="font-semibold text-gray-900">{request.request_code || "N/A"}</p>
                    <p className="text-sm text-gray-600">{formatDateTime(request.created_at)}</p>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <p className="text-sm text-gray-600">
                      {request.items_count} {request.items_count === 1 ? "Item" : "Items"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{request.status}</span>
                  </div>

                  {!NON_DELETABLE_STATUSES.includes(request.status.toUpperCase()) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault(); 
                        setDeleteId(request.id);
                        setConfirmOpen(true);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-lg min-h-[400px]">
          <TabPanel value={value} index={0}>
            <div className="p-6">
              {/* Search and Add Button Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                  {renderSearchBar()}
                </div>
                <button
                  onClick={handleNewShoppingRequest}
                  className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <AddIcon className="w-4 h-4" />
                  Shopping Request
                </button>
              </div>

              {/* Shopping Requests List */}
              {isLoading ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress />
                  </div>
                ) : shoppingRequests.length > 0 ? (
                  <>
                    {renderShoppingRequests()}
                    
                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Showing 1 to {shoppingRequests.length} of {shoppingRequests.length} Requests
                      </p>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded disabled:opacity-50" disabled>
                          Previous
                        </button>
                        <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded disabled:opacity-50" disabled>
                          Next
                        </button>
                      </div>
                    </div>
                  </>
              ) : (
                renderEmptyState(<ShoppingBagIcon />, "No Shopping Requests Available")
              )}
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            {renderSearchBar()}
            {renderEmptyState(<HistoryIcon />, "No History Available")}
          </TabPanel>
        </div>

        {/* How It Works Modal */}
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
          onConfirm={() => deleteId && handleDeleteRequest(deleteId)}
          onClose={() => setConfirmOpen(false)}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
