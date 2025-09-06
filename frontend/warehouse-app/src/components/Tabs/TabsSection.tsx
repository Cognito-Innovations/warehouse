"use client";
import { toast } from "sonner";
import React, { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { shipmentsData } from "../../data/shipmentsData";
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
  // TODO: Remove this HARDCODED VALUES 
  const { submitPreArrival, loading: submitting, error: submitError } = usePreArrival({ customer: "Rohit Sharma", suite: "102-529" });

  const fetchPackages = async () => {
    const userId = (session?.user as any)?.user_id;
    console.log("Fetching packages for userId:", userId);
    console.log("Session data:", session);
    
    if (!userId) {
      console.log("No userId found, skipping fetch");
      return;
    }
    
    setPackagesLoading(true);
    try {
      console.log("Calling API with userId:", userId, "status: Ready to Send");
      const data = await getPackagesByUserAndStatus(userId, "Ready to Send");
      console.log("API response:", data);
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setPackagesLoading(false);
    }
  };

  const fetchShipments = async () => {
    const userId = (session?.user as any)?.user_id;
    console.log("Fetching shipments for userId:", userId);
    
    if (!userId) {
      console.log("No userId found, skipping fetch");
      return;
    }
    
    setShipmentsLoading(true);
    try {
      console.log("Calling API with userId:", userId, "status: Request Ship");
      const data = await getShipmentsByUser(userId);
      console.log("Shipments API response:", data);
      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
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

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setSearchTerm("");
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
      console.log("Requesting ship for package:", packageId);
      await updatePackageStatus(packageId, "Request Ship");
      toast.success("Ship request submitted successfully!");
      // Refresh packages and shipments after status change
      fetchPackages();
      fetchShipments();
    } catch (error) {
      console.error("Error requesting ship:", error);
      toast.error("Failed to request ship. Please try again.");
    }
  };

  const tabs = [
    { label: "Packages", count: packages.length, icon: <PackageIcon /> },
    { label: "Shipments", count: shipments.length, icon: <ShipmentIcon /> },
    { label: "History", count: 0, icon: <HistoryIcon /> },
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
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
                        <p className="text-sm text-gray-600">Status: <span className="text-green-600 font-medium">{pkg.status}</span></p>
                        {pkg.customer && (
                          <p className="text-sm text-gray-600">Customer: <span className="font-medium">{pkg.customer.name}</span></p>
                        )}
                        {pkg.total_weight && (
                          <p className="text-sm text-gray-600">Weight: {pkg.total_weight} kg</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Created: {new Date(pkg.created_at).toLocaleDateString()}</p>
                          {pkg.country && (
                            <p className="text-sm text-gray-500">Country: {pkg.country}</p>
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
                  <div key={shipment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{shipment.tracking_no}</h4>
                        <p className="text-sm text-gray-600">Package ID: {shipment.package_id}</p>
                        <p className="text-sm text-gray-600">Status: <span className="text-blue-600 font-medium">{shipment.status}</span></p>
                        {shipment.customer && (
                          <p className="text-sm text-gray-600">Customer: <span className="font-medium">{shipment.customer.name}</span></p>
                        )}
                        {shipment.total_weight && (
                          <p className="text-sm text-gray-600">Weight: {shipment.total_weight} kg</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Created: {new Date(shipment.created_at).toLocaleDateString()}</p>
                          {shipment.country && (
                            <p className="text-sm text-gray-500">Country: {shipment.country}</p>
                          )}
                        </div>
                        {/* <div className="flex gap-2">
                          <button
                            className="inline-flex bg-green-600 hover:bg-green-700 text-white items-center px-3 py-2 transition-all ease-in-out border border-transparent shadow-sm text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Track Shipment
                          </button>
                          <button
                            className="inline-flex bg-gray-600 hover:bg-gray-700 text-white items-center px-3 py-2 transition-all ease-in-out border border-transparent shadow-sm text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            View Details
                          </button>
                        </div> */}
                      </div>
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