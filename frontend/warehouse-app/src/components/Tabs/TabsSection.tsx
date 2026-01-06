"use client";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import {
  Delete as DeleteIcon,
  HourglassEmpty as HourglassIcon,
  Upload as UploadIcon,
  Inventory as PackageIcon,
  LocalShipping as ShipmentIcon, 
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import HistoryIcon from "@mui/icons-material/History";
import CheckIcon from "@mui/icons-material/Check";

import {
  updatePackageStatus,
  getPackagesByUser,
  getPreArrivalsByUser,
  deletePreArrival,
  uploadPackageDocuments,
  createShipment,
  getShipmentsByUser,
} from "../../lib/api.service";
import { useAuth } from "@/contexts/AuthContext";
import usePreArrival from "../../hooks/usePreArrival";
import TabPanel from "./TabPanel";
import TabNavigation from "./TabNavigation";
import SearchAndFilter from "./SearchAndFilter";
import PrePackageArrivalOTPModal from "../Modals/PrePackageArrivalOTPModal/PrePackageArrivalOTPModal";
import PreArrivalPopup from "../Modals/PrePackageArrivalOTPModal/PreArrivalPopup";
import SearchBar from "./SearchBar";
import EmptyState from "./EmptyState";
import ExpandedPackageSection from "./ExpandedPackageSection";
import { formatDateTime } from "@/lib/utils";
import { getStatusProps } from "@/lib/statusUtils";
import { ROUTES } from "@/utils/constants";

const TabsSection = () => {
  const { user } = useAuth();
  const { data: session } = useSession();
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [packages, setPackages] = useState<any[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(false);
  const [preArrivalHistory, setPreArrivalHistory] = useState<any[]>([]);
  const [preArrivalLoading, setPreArrivalLoading] = useState(false);
  const [newPreArrival, setNewPreArrival] = useState<any | null>(null);
  const [isPreArrivalPopupOpen, setIsPreArrivalPopupOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadedPackageIds, setUploadedPackageIds] = useState<string[]>([]);
  const [uploadingPackageId, setUploadingPackageId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [isRequestingShip, setIsRequestingShip] = useState(false);
  const [expandedPackages, setExpandedPackages] = useState<string[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { submitPreArrival, loading: submitting } = usePreArrival({
    userId: user?.id,
  });

  const fetchPackages = async () => {
    const userId = (session?.user as any)?.user_id;
    if (!userId) return;

    setPackagesLoading(true);
    try {
      const data = await getPackagesByUser(userId);

      const filteredPackages = data.filter(
        (pkg: any) => ["Action Required", "In Review", "Ready To Send"].includes(pkg.status.value)
      );

      setPackages(filteredPackages);
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
      const shipments = await getShipmentsByUser(userId);
      setShipments(shipments);
    } catch (error) {
      toast.error("Failed to fetch shipments");
    } finally {
      setShipmentsLoading(false);
    }
  };

  const fetchPreArrivals = async () => {
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
  };

  useEffect(() => {
    fetchPackages();
    fetchShipments();
    fetchPreArrivals();
  }, [(session?.user as any)?.user_id]);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, packageId: string) => {
    if (e.target.checked) {
      setSelectedPackageIds((prev) => [...prev, packageId]);
    } else {
      setSelectedPackageIds((prev) => prev.filter((id) => id !== packageId));
    }
  };

  const handleRequestShip = async () => {
    const userId = (session?.user as any)?.user_id;
    if (!userId || selectedPackageIds.length === 0) return;

    setIsRequestingShip(true);
    try {
      const payload = { packageIds: selectedPackageIds }; 
      await createShipment(payload); 
      
      toast.success("Shipment requested successfully!");
      setSelectedPackageIds([]);
      fetchPackages();
      fetchShipments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to request shipment. Please try again.");
    } finally {
      setIsRequestingShip(false);
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

  const handleUploadDocument = async (pkgId: string) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*,.pdf";
      input.multiple = true;

      input.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = Array.from(target.files || []) as File[];
        if (files.length === 0) return;

        setUploadingPackageId(pkgId);
        try {
          await uploadPackageDocuments(pkgId, files);
          await updatePackageStatus(pkgId, "In Review");

          toast.success("Document uploaded successfully and under review.");
          setUploadedPackageIds((prev) => [...prev, pkgId]);
          fetchPackages();
        } catch (err) {
          console.error("Upload failed:", err);
          toast.error("Failed to upload document. Please tray again.");
        } finally {
          setUploadingPackageId(null);
        }
      };

      input.click();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload document. Please try again.");
    }
  };

  const toggleExpand = (packageId: string) => {
    setExpandedPackages((prev) => {
      if (prev.includes(packageId)) {
        return prev.filter((id) => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  };

  const tabs = [
    { label: "Packages", count: packages.length, icon: <PackageIcon /> },
    { label: "Shipments", count: shipments.length, icon: <ShipmentIcon /> },
    { label: "History", count: preArrivalHistory.length, icon: <HistoryIcon /> },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <TabNavigation tabs={tabs} value={value} onChange={handleChange}/>

      {/* Search + Filter: show for Shipments and History */}
      {(value === 1) && (
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          placeholder={`Search ${tabs[value].label.toLowerCase()}...`}
        />
      )}

      {value === 2 && (
        <div className="p-4">
          <SearchBar
            placeholder="Search by Tracking Number..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      )}
      
      {/* Share OTP Button - Only show on Packages tab */}
      {value === 0 && (
        <div className="flex justify-end my-3">
          {selectedPackageIds.length > 0 && (
            <button
              onClick={handleRequestShip}
              disabled={isRequestingShip}
              className="inline-flex bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white items-center px-3 py-2 transition-all ease-in-out border border-transparent shadow-sm text-sm rounded-md focus:outline-none mr-2"
            >
              {isRequestingShip ? (
                <>
                  <CircularProgress size={16} className="mr-2 text-white" />
                  Requesting...
                </>
              ) : (
                `Request Ship (${selectedPackageIds.length})`
              )}
            </button>
          )}

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
                {packages.map((pkg) => {
                  const isExpanded = expandedPackages.includes(pkg.id);
                  return (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {isExpanded ? (
                            <ExpandLess
                              onClick={() => toggleExpand(pkg.id)}
                              className="cursor-pointer text-gray-500 hover:text-gray-700"
                            />
                          ) : (
                            <ExpandMore
                              onClick={() => toggleExpand(pkg.id)}
                              className="cursor-pointer text-gray-500 hover:text-gray-700"
                            />
                          )}
                        </div>
                        
                        {pkg.status.value === "Ready To Send" && (
                          <div className="flex-shrink-0 self-center">
                            <input
                              type="checkbox"
                              className="h-5 w-5 appearance-none border-2 border-gray-300 rounded bg-white grid place-content-center
                                checked:bg-blue-600 checked:border-blue-600 cursor-pointer
                                checked:after:content-['✔'] checked:after:text-white checked:after:text-xs checked:after:font-bold"
                              checked={selectedPackageIds.includes(pkg.id)}
                              onChange={(e) => handleCheckboxChange(e, pkg.id)}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{pkg.tracking_no}</h4>
                          <p className="text-sm text-gray-600">Package ID: {pkg.package_id}</p>
                          <p className="text-sm text-gray-600">Status: <span className="text-green-600 font-medium">{pkg.status.value}</span></p>
                          {pkg.user && (
                            <p className="text-sm text-gray-600">Customer: <span className="font-medium">{pkg.user.name}</span></p>
                          )}
                          {pkg.total_weight && (
                            <p className="text-sm text-gray-600">Weight: {pkg.total_weight} kg</p>
                          )}
                          {pkg.remarks && (
                            <p className="text-sm text-gray-600">Remarks: {pkg.remarks}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Created: {formatDateTime(pkg.created_at)}</p>
                            {pkg.country && (
                              <p className="text-sm text-gray-500">Country: {pkg.country?.name}</p>
                            )}
                          </div>
                          {pkg.status.value === "Action Required" ? (
                            uploadedPackageIds.includes(pkg.id) ? (
                              <p className="text-green-600 text-sm font-medium">
                                Document uploaded successfully and under review.
                              </p>
                            ) : (
                              <button
                                disabled={uploadingPackageId === pkg.id}
                                onClick={() => handleUploadDocument(pkg.id)}
                                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border transition-all 
                                  ${uploadingPackageId === pkg.id 
                                    ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed" 
                                    : "text-blue-600 border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                  }`}
                              >
                                {uploadingPackageId === pkg.id ? (
                                  <>
                                    <CircularProgress size={16} className="mr-2 text-blue-500" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <UploadIcon className="mr-2" fontSize="small" />
                                    Upload File
                                  </>
                                )}
                              </button>
                            )
                          ) : pkg.status.value === "In Review" ? (
                            <p className="text-green-600 text-sm font-medium">Document uploaded successfully and under review.</p>
                          ) : null}
                        </div>
                    </div>
                    {isExpanded &&
                      <div className="mt-4">
                        <ExpandedPackageSection documents={pkg.documents || []} />
                      </div>
                    }
                  </div>
                  );
                })}
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
                {shipments.map((shipment) => {
                  const { IconComponent, colorClassName } = getStatusProps(shipment.status);
                  return (
                    <div
                      key={shipment.id}
                      onClick={() => router.push(`${ROUTES.SHIPMENT}/${shipment.shipment_no}`)}
                      className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {shipment.shipment_no}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(shipment.created_at)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 font-medium ${colorClassName}`}>
                          <IconComponent fontSize="small" />
                          <span className="uppercase">{shipment.status}</span>
                        </div>
                        {/* Uncomment when backend is ready */}
                        {/* <button
                          className="text-red-500 hover:text-red-700 transition"
                          onClick={() => console.log("delete", shipment.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </button> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabPanel>

        <TabPanel value={value} index={2}>
          {preArrivalLoading ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress />
            </div>
          ) : preArrivalHistory.length === 0 ? (
            <EmptyState icon={<HistoryIcon />} message="No OTP History Available" />
          ) : (
            <div className="p-4 space-y-4">
              {preArrivalHistory
                .filter((preArrival) =>
                  !searchTerm || preArrival.tracking_no.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((preArrival) => (
                  <div
                    key={preArrival.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium truncate">
                        Tracking No: <span className="font-semibold">{preArrival.tracking_no}</span>
                      </p>
                    </div>
                  
                    <div className="flex-1 text-center">
                      <p className="text-sm text-gray-700 font-medium truncate">
                        OTP: <span className="font-semibold">{preArrival.otp}</span>
                      </p>
                    </div>
                  
                    <div className="flex items-center gap-2">
                      {preArrival.status === "pending" ? (
                        <>
                          <HourglassIcon className="text-yellow-500" />
                          <span className="text-yellow-600 font-semibold uppercase text-sm">
                            Pending
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="text-green-500" />
                          <span className="text-green-600 font-semibold uppercase text-sm">
                            Received
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabPanel>

      </div>

      {/* OTP Modal */}
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

export default TabsSection;