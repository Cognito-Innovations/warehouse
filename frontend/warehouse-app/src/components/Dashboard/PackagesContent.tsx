"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import {
    Upload as UploadIcon,
    Inventory as PackageIcon,
    ExpandMore,
    ExpandLess,
} from "@mui/icons-material";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    getPackagesByUser,
    uploadPackageDocuments,
    updatePackageStatus,
    createShipment,
} from "@/lib/api.service";
import { formatDateTime } from "@/lib/utils";
import { getStatusProps } from "@/lib/statusUtils";
import { ROUTES } from "@/utils/constants";
import EmptyState from "../Tabs/EmptyState";
import ExpandedPackageSection from "../Tabs/ExpandedPackageSection";
import SearchAndFilter from "../Tabs/SearchAndFilter";
import PrePackageArrivalOTPModal from "../Modals/PrePackageArrivalOTPModal/PrePackageArrivalOTPModal";
import PreArrivalPopup from "../Modals/PrePackageArrivalOTPModal/PreArrivalPopup";
import usePreArrival from "@/hooks/usePreArrival";
import { useAuth } from "@/contexts/AuthContext";

const PackagesContent = () => {
    const { user } = useAuth();
    const router = useRouter();
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

    const fetchData = async () => {
        const userId = (session?.user as any)?.user_id;
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
    };

    useEffect(() => {
        fetchData();
    }, [(session?.user as any)?.user_id, user?.id]);

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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">Ready to Send Packages</h2>
                <div className="flex gap-2 items-center shrink-0">
                    {selectedPackageIds.length > 0 && (
                        <button
                            onClick={handleRequestShip}
                            disabled={isRequestingShip}
                            className="inline-flex bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white items-center justify-center px-3 sm:px-4 py-2 transition-all ease-in-out border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md focus:outline-none whitespace-nowrap"
                        >
                            {isRequestingShip ? (
                                <>
                                    <CircularProgress size={14} className="mr-2 text-white" />
                                    <span className="hidden sm:inline">Requesting...</span>
                                </>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Request Ship ({selectedPackageIds.length})</span>
                                    <span className="sm:hidden">Ship ({selectedPackageIds.length})</span>
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={() => setIsOTPModalOpen(true)}
                        className="inline-flex bg-purple-600 hover:bg-purple-700 text-white items-center justify-center px-3 sm:px-4 py-2 transition-all ease-in-out border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md focus:outline-none whitespace-nowrap"
                    >
                        Share OTP
                    </button>
                </div>
            </div>

            <div className="p-4 border-b border-gray-100">
                <SearchAndFilter
                    searchTerm={packageSearchTerm}
                    onSearchChange={setPackageSearchTerm}
                    selectedFilter={packageFilter}
                    onFilterChange={setPackageFilter}
                    placeholder="Search tracking no..."
                />
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
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
                            filteredPackages.map((pkg) => {
                                const status = pkg.status?.value || pkg.status;
                                const { IconComponent, colorClassName } = getStatusProps(status);
                                const isSelected = isPackageSelected(pkg.id);
                                const isExpanded = expandedPackages.includes(pkg.id);

                                return (
                                    <React.Fragment key={pkg.id}>
                                        <tr
                                            className={`group transition-all duration-200 ${isSelected ? "bg-purple-50/50" : "hover:bg-gray-50/80"
                                                }`}
                                        >
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer disabled:opacity-30"
                                                    checked={isSelected}
                                                    onChange={() => togglePackageSelection(pkg.id)}
                                                />
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                                                        {pkg.tracking_no}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 font-medium">{pkg.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit ${colorClassName} bg-opacity-10 font-bold`}>
                                                        <IconComponent className="text-[14px]" />
                                                        <span className="uppercase text-[9px] sm:text-[10px] tracking-wider">{status}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-600 font-medium">{pkg.customer_name || pkg.user?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800">{pkg.weight || pkg.total_weight} KG</span>
                                                    <span className="text-[11px] text-gray-400 font-medium">{pkg.package_count || 1} items</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                                                <div className="flex justify-end items-center gap-3">
                                                    <button
                                                        onClick={() => handleUploadDocument(pkg.id)}
                                                        disabled={uploadingPackageId === pkg.id}
                                                        className={`${uploadingPackageId === pkg.id ? "text-gray-300 cursor-not-allowed" : "text-purple-600 hover:text-purple-800 hover:underline"} transition-all flex items-center gap-1`}
                                                    >
                                                        {uploadingPackageId === pkg.id ? (
                                                            <CircularProgress size={14} className="text-purple-600" />
                                                        ) : (
                                                            "Upload Docs"
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => toggleExpand(pkg.id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                                                    <ExpandedPackageSection documents={pkg.documents || []} />
                                                    {pkg.remarks && (
                                                        <div className="mt-2 text-sm text-gray-600 font-medium">
                                                            <span className="text-gray-400 uppercase text-[10px] tracking-wider block">Remarks</span>
                                                            {pkg.remarks}
                                                        </div>
                                                    )}
                                                    <div className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        Created: {formatDateTime(pkg.created_at)}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
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
