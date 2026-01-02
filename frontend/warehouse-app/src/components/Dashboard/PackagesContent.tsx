"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import { Inventory as PackageIcon } from "@mui/icons-material";
import { toast } from "sonner";

import {
    getPackagesByUser,
    uploadPackageDocuments,
    updatePackageStatus,
    createShipment,
} from "@/lib/api.service";
import { formatDateTime } from "@/lib/utils";
import EmptyState from "../Tabs/EmptyState";
import SearchAndFilter from "../Tabs/SearchAndFilter";
import PrePackageArrivalOTPModal from "../Modals/PrePackageArrivalOTPModal/PrePackageArrivalOTPModal";
import PreArrivalPopup from "../Modals/PrePackageArrivalOTPModal/PreArrivalPopup";
import usePreArrival from "@/hooks/usePreArrival";
import { useAuth } from "@/contexts/AuthContext";
import PackageHeader from "./Packages/PackageHeader";
import PackageCardMobile from "./Packages/PackageCardMobile";
import PackageTableRow from "./Packages/PackageTableRow";

const PackagesContent = () => {
    const { user } = useAuth();
    const { data: session } = useSession();
    const [packages, setPackages] = useState<any[]>([]);
    const [packagesLoading, setPackagesLoading] = useState(false);
    const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
    const [isRequestingShip, setIsRequestingShip] = useState(false);
    const [expandedPackages, setExpandedPackages] = useState<string[]>([]);

    const [packageSearchTerm, setPackageSearchTerm] = useState("");
    const [packageFilter, setPackageFilter] = useState("all");

    // OTP Modal State
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [isPreArrivalPopupOpen, setIsPreArrivalPopupOpen] = useState(false);
    const [newPreArrival, setNewPreArrival] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadingPackageId, setUploadingPackageId] = useState<string | null>(null);
    const [uploadedPackageIds, setUploadedPackageIds] = useState<string[]>([]);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const { submitPreArrival, loading: submitting } = usePreArrival({
        userId: user?.id,
    });

    const userId = (session?.user as any)?.user_id;

    const fetchData = useCallback(async () => {
        if (!userId) return;

        setPackagesLoading(true);
        try {
            const pkgs = await getPackagesByUser(userId);
            // Filter only relevant for dash
            const relevantPackages = pkgs.filter(
                (pkg: any) => ["Action Required", "In Review", "Ready To Send", "READY_TO_SHIP"].includes(pkg.status?.value || pkg.status)
            );
            setPackages(relevantPackages);
        } catch (error) {
            toast.error("Failed to fetch packages");
        } finally {
            setPackagesLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredPackages = packages.filter((pkg) => {
        const status = pkg.status?.value || pkg.status;
        const matchesSearch = pkg.tracking_no.toLowerCase().includes(packageSearchTerm.toLowerCase());
        const matchesFilter = packageFilter === "all" || status.toLowerCase() === packageFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const isPackageSelected = (id: string) => selectedPackageIds.includes(id);

    const togglePackageSelection = (id: string) => {

        setSelectedPackageIds((prev) =>
            prev.includes(id) ? prev.filter((pkgId) => pkgId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedPackageIds.length === packages.length && packages.length > 0) {
            setSelectedPackageIds([]);
        } else {
            setSelectedPackageIds(packages.map((pkg) => pkg.id));
        }
    };

    const handleRequestShip = async () => {
        if (selectedPackageIds.length === 0) return;

        setIsRequestingShip(true);
        try {
            const payload = { packageIds: selectedPackageIds };
            await createShipment(payload);

            toast.success("Shipment requested successfully!");
            setSelectedPackageIds([]);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to request shipment. Please try again.");
        } finally {
            setIsRequestingShip(false);
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
                    fetchData();
                } catch (err) {
                    console.error("Upload failed:", err);
                    toast.error("Failed to upload document. Please try again.");
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

    const handleOTPSubmit = async (data: any) => {
        setFormErrors({});
        try {
            const createdOTP = await submitPreArrival(data);
            setNewPreArrival(createdOTP);
            setIsPreArrivalPopupOpen(true);
            setIsOTPModalOpen(false);
            toast.success("OTP sent successfully!");
        } catch (err: any) {
            if (err.response?.data?.message) {
                const errorMessage = err.response.data.message;
                const parsedErrors: Record<string, string> = {};
                const errorParts = errorMessage.split(", ");
                errorParts.forEach((part: string) => {
                    if (part.toLowerCase().includes("otp")) parsedErrors.otp = part;
                    if (part.toLowerCase().includes("tracking number")) parsedErrors.trackingNumber = part;
                });
                setFormErrors(parsedErrors);
            } else {
                toast.error("Failed to send OTP");
            }
        }
    };

    return (
        <div className="min-h-screen bg-white border border-gray-200 rounded-lg shadow-sm">
            <PackageHeader
                selectedCount={selectedPackageIds.length}
                isRequestingShip={isRequestingShip}
                onRequestShip={handleRequestShip}
                onShareOTP={() => setIsOTPModalOpen(true)}
            />

            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-100">
                <SearchAndFilter
                    searchTerm={packageSearchTerm}
                    onSearchChange={setPackageSearchTerm}
                    selectedFilter={packageFilter}
                    onFilterChange={setPackageFilter}
                    placeholder="Search tracking no..."
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 p-4 space-y-3">
                {packagesLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <CircularProgress size={32} className="text-purple-600" />
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div className="py-12">
                        <EmptyState icon={<PackageIcon />} message="No Packages Found" />
                    </div>
                ) : (
                    filteredPackages.map((pkg) => (
                        <PackageCardMobile
                            key={pkg.id}
                            pkg={pkg}
                            isSelected={isPackageSelected(pkg.id)}
                            isExpanded={expandedPackages.includes(pkg.id)}
                            isUploading={uploadingPackageId === pkg.id}
                            onSelect={() => togglePackageSelection(pkg.id)}
                            onUpload={() => handleUploadDocument(pkg.id)}
                            onToggleExpand={() => toggleExpand(pkg.id)}
                        />
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
                    <thead className="bg-gray-50/95 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                        <tr>
                            <th scope="col" className="px-4 sm:px-6 py-4 text-left border-b border-gray-200">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                                    checked={packages.length > 0 && selectedPackageIds.length === packages.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>

                            <th scope="col" className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                Tracking No / ID
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                Status / Customer
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                Weight / Count
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-4 text-right text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {packagesLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <CircularProgress size={32} className="text-purple-600" />
                                </td>
                            </tr>
                        ) : filteredPackages.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <EmptyState icon={<PackageIcon />} message="No Packages Found" />
                                </td>
                            </tr>
                        ) : (
                            filteredPackages.map((pkg) => (
                                <PackageTableRow
                                    key={pkg.id}
                                    pkg={pkg}
                                    isSelected={isPackageSelected(pkg.id)}
                                    isExpanded={expandedPackages.includes(pkg.id)}
                                    isUploading={uploadingPackageId === pkg.id}
                                    onSelect={() => togglePackageSelection(pkg.id)}
                                    onUpload={() => handleUploadDocument(pkg.id)}
                                    onToggleExpand={() => toggleExpand(pkg.id)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <PrePackageArrivalOTPModal
                isOpen={isOTPModalOpen}
                onClose={() => setIsOTPModalOpen(false)}
                onSubmit={handleOTPSubmit}
                isLoading={submitting}
                errors={formErrors}
            />

            <PreArrivalPopup
                isOpen={isPreArrivalPopupOpen}
                onClose={() => setIsPreArrivalPopupOpen(false)}
                onDelete={async () => {
                    if (!newPreArrival?.id) return;
                    setIsDeleting(true);
                    try {
                        const { deletePreArrival } = await import("@/lib/api.service");
                        await deletePreArrival(newPreArrival.id);
                        toast.success("Pre-arrival deleted successfully!");
                        setIsPreArrivalPopupOpen(false);
                    } catch (err) {
                        toast.error("Failed to delete pre-arrival");
                    } finally {
                        setIsDeleting(false);
                    }
                }}
                onCreateNew={() => {
                    setIsPreArrivalPopupOpen(false);
                    setIsOTPModalOpen(true);
                }}
                preArrivalData={newPreArrival ? {
                    otp: newPreArrival.otp,
                    eta: newPreArrival.estimate_arrival_time,
                    trackingNo: newPreArrival.tracking_no,
                    requestedAt: formatDateTime(newPreArrival.created_at),
                    status: newPreArrival.status,
                    details: newPreArrival.details || ""
                } : null}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default PackagesContent;
