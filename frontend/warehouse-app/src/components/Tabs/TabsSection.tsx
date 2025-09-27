"use client";
import { toast } from "sonner";
import React, { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Delete as DeleteIcon, HourglassEmpty as HourglassIcon } from "@mui/icons-material";
import { getPackagesByUserAndStatus, updatePackageStatus, getShipmentsByUser } from "../../lib/api.service";

import usePreArrival from "../../hooks/usePreArrival";
import PrePackageArrivalOTPModal from "../Modals/PrePackageArrivalOTPModal/PrePackageArrivalOTPModal";
import { Inventory as PackageIcon, LocalShipping as ShipmentIcon, History as HistoryIcon } from "@mui/icons-material";

// Import extracted components
import TabPanel from "./TabPanel";
import TabNavigation from "./TabNavigation";
import SearchAndFilter from "./SearchAndFilter";
import EmptyState from "./EmptyState";
import ShipmentsTable from "./ShipmentsTable";
import { formatDateTime } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";

const TabsSection = () => {
  const { data: session } = useSession();
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // TODO: Remove this HARDCODED VALUES 
  const { submitPreArrival, loading: submitting, error: submitError } = usePreArrival({ customer: "Rohit Sharma", suite: "102-529" });

  const SHIPMENT_STATUSES = [
    "Request Ship",
    "Payment Pending",
    "Payment Approved",
    "Ready To Ship",
    "Departed",
  ];

  const fetchPackages = async () => {
    const userId = (session?.user as any)?.user_id;
    if (!userId) return;

    setPackagesLoading(true);
    try {
      const data = await getPackagesByUserAndStatus(userId, "Ready To Send");
      setPackages(data);
    } catch (error) {
      toast.error("Failed to fetch packages");
    } finally {
      setPackagesLoading(false);
    }
  };

  const fetchShipments = async () => {
    const userId = (session?.user as any)?.user_id;
    if (!userId) return;

    setShipmentsLoading(true);
    try {
      const results = await Promise.all(
        SHIPMENT_STATUSES.map((status) => getPackagesByUserAndStatus(userId, status))
      );
      setShipments(results.flat());
    } catch (error) {
      toast.error("Failed to fetch shipments");
    } finally {
      setShipmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchShipments();
  }, [(session?.user as any)?.user_id]);

  const filteredShipments = useMemo(() => {
    const shipmentsDataState: any[] = [];
    return shipmentsDataState.filter((s) => {
      const matchesFilter = selectedFilter === "all" || s.status === selectedFilter;
      const matchesSearch =
        !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchTerm]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "shipments") {
      setValue(1);
    } else if (tab === "history") {
      setValue(2);
    } else {
      setValue(0);
    }
  }, [searchParams]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    // setSearchTerm("");
    const tabName = newValue === 1 ? "shipments" : newValue === 2 ? "history" : "packages";
    router.push(`?tab=${tabName}`);
  };

  const handleShareOTPClick = () => {
    setIsOTPModalOpen(true);
  };

  const handleOTPModalClose = () => {
    setIsOTPModalOpen(false);
  };

  const handleOTPSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await submitPreArrival(data);
      setIsOTPModalOpen(false);
      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error("Failed to send OTP", {
        description: err instanceof Error ? err.message : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestShip = async (packageId: string) => {
    try {
      await updatePackageStatus(packageId, "Request Ship");
      toast.success("Ship request submitted successfully!");
      // Refresh packages and shipments after status change
      fetchPackages();
      fetchShipments();
    } catch (error) {
      toast.error("Failed to request ship. Please try again.");
    }
  };

  const tabs = [
    { label: "Packages", count: packages.length, icon: <PackageIcon /> },
    { label: "Shipments", count: shipments.length, icon: <ShipmentIcon /> }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <TabNavigation tabs={tabs} value={value} onChange={handleChange}/>

      {/* Search + Filter: show for Shipments and History */}
      {(value === 1 || value === 2) && (
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          placeholder={`Search ${tabs[value].label.toLowerCase()}...`}
        />
      )}
      
      {/* Share OTP Button - Only show on Packages tab */}
      {value === 0 && (
        <div className="flex justify-end my-3">
          <button onClick={handleShareOTPClick} className="inline-flex bg-purple-600 hover:bg-purple-700 min-w-12 text-white items-center px-3 py-2 transition-all ease-in-out border border-transparent shadow-sm text-sm rounded-md focus:outline-none">
            Share OTP
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-lg min-h-[300px]">
        <TabPanel value={value} index={0}>
          {packagesLoading ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress />
            </div>
          ) : packages.length === 0 ? (
            <EmptyState icon={<PackageIcon />} message="No Packages Available" />
          ) : (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ready to Send Packages</h3>
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{pkg.tracking_no}</h4>
                        <p className="text-sm text-gray-600">Package ID: {pkg.package_id}</p>
                        <p className="text-sm text-gray-600">Status: <span className="text-green-600 font-medium">{pkg.status.value}</span></p>
                        {pkg.customer && (
                          <p className="text-sm text-gray-600">Customer: <span className="font-medium">{pkg.customer.name}</span></p>
                        )}
                        {pkg.total_weight && (
                          <p className="text-sm text-gray-600">Weight: {pkg.total_weight} kg</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Created: {formatDateTime(pkg.created_at)}</p>
                          {pkg.country && (
                            <p className="text-sm text-gray-500">Country: {pkg.country?.name}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRequestShip(pkg.id)}
                          className="inline-flex bg-blue-600 hover:bg-blue-700 text-white items-center px-4 py-2 transition-all ease-in-out border border-transparent shadow-sm text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Request Ship
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
          {shipmentsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : shipments.length === 0 ? (
            <EmptyState icon={<ShipmentIcon />} message="No Shipments Available" />
          ) : (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Ship Packages</h3>
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    onClick={() => router.push(`/shipment/${shipment.shipment_id}`)}
                    className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {shipment.shipment_id}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(shipment.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <HourglassIcon fontSize="small" className="text-gray-500" />
                        <span className="uppercase font-medium">{shipment.status.value}</span>
                      </div>

                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => console.log("delete", shipment.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabPanel>

        <TabPanel value={value} index={2}>
          {filteredShipments.length === 0 ? (
            <EmptyState icon={<HistoryIcon />} message="No History Available" />
          ) : (
            <ShipmentsTable shipments={filteredShipments} />
          )}
        </TabPanel>
      </div>

      {/* OTP Modal */}
      <PrePackageArrivalOTPModal 
        isOpen={isOTPModalOpen} 
        onClose={handleOTPModalClose} 
        onSubmit={handleOTPSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default TabsSection;