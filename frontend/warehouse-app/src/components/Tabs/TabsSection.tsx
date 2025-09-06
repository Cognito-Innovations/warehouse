"use client";
import { toast } from "sonner";
import React, { useState, useMemo, useEffect } from "react";
import { shipmentsData } from "../../data/shipmentsData";

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
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // TODO: Remove this HARDCODED VALUES 
  const { submitPreArrival, loading: submitting, error: submitError } = usePreArrival({ customer: "Rohit Sharma", suite: "102-529" });

  const filteredShipments = useMemo(() => {
    return shipmentsData.filter((s) => {
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

  const tabs = [
    { label: "Packages", count: 0, icon: <PackageIcon /> },
    { label: "Shipments", count: 0, icon: <ShipmentIcon /> },
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
          <EmptyState icon={<PackageIcon />} message="No Packages Available" />
        </TabPanel>

        <TabPanel value={value} index={1}>
          {filteredShipments.length === 0 ? (
            <EmptyState icon={<ShipmentIcon />} message="No Shipments Available" />
          ) : (
            <ShipmentsTable shipments={filteredShipments} />
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