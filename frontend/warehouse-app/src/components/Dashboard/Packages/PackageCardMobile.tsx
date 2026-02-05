import React from "react";
import { getStatusProps } from "@/lib/statusUtils";
import { formatDateTime } from "@/lib/utils";
import ExpandedPackageSection from "../../Tabs/ExpandedPackageSection";
import PackageActions from "./PackageActions";

interface PackageCardMobileProps {
    pkg: any;
    isSelected: boolean;
    isExpanded: boolean;
    isUploading: boolean;
    onSelect: () => void;
    onUpload: () => void;
    onToggleExpand: () => void;
}

const PackageCardMobile: React.FC<PackageCardMobileProps> = ({
    pkg,
    isSelected,
    isExpanded,
    isUploading,
    onSelect,
    onUpload,
    onToggleExpand,
}) => {
    const status = pkg.status?.value || pkg.status;
    const { IconComponent, colorClassName } = getStatusProps(status);
    const hasDocuments = pkg.documents && pkg.documents.length > 0;

    return (
        <div
            className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                isSelected ? "bg-purple-50/50 border-purple-200" : "bg-white hover:shadow-md"
            }`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-1">
                    <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer disabled:opacity-30"
                        checked={isSelected}
                        onChange={onSelect}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {/* Tracking No / ID - Primary Info */}
                    <div className="mb-4">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
                            Tracking No / ID
                        </div>
                        <div className="text-base font-bold text-gray-900 truncate">
                            {pkg.tracking_no}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                            {pkg.id}
                        </div>
                    </div>

                    {/* Status - Secondary Info */}
                    <div className="mb-4">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
                            Status
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${colorClassName} bg-opacity-10 font-bold`}>
                            <IconComponent className="text-[14px]" />
                            <span className="uppercase text-[10px] tracking-wider">{status}</span>
                        </div>
                        {pkg.discard_comment && (
                            <p className="mt-1.5 text-xs text-red-600 font-medium">{pkg.discard_comment}</p>
                        )}
                    </div>

                    {/* Customer - Secondary Info */}
                    <div className="mb-4">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
                            Customer
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                            {pkg.customer_name || pkg.user?.name || "N/A"}
                        </div>
                    </div>

                    {/* Weight / Count - Secondary Info */}
                    <div className="mb-4">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
                            Weight / Count
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-bold text-gray-800">
                                {pkg.weight || pkg.total_weight || 0} KG
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {pkg.package_count || 1} {pkg.package_count === 1 ? "item" : "items"}
                            </div>
                        </div>
                    </div>

                    {pkg.remarks && (
                                <div className="mb-3 text-sm text-gray-600 font-medium">
                                    <span className="text-gray-400 uppercase text-[10px] tracking-wider block mb-1">
                                        Remarks
                                    </span>
                                    {pkg.remarks}
                                </div>
                            )}

                    {/* Actions */}
                    <div className="pt-2 border-t border-gray-100">
                        <PackageActions
                            packageId={pkg.id}
                            documents={pkg.documents || []}
                            isUploading={isUploading}
                            isExpanded={isExpanded}
                            onUpload={onUpload}
                            onToggleExpand={onToggleExpand}
                        />
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            {hasDocuments && (
                                <div className="mb-4">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
                                        Documents
                                    </div>
                                    <ExpandedPackageSection documents={pkg.documents || []} />
                                </div>
                            )}
                           
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Created: {formatDateTime(pkg.created_at)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PackageCardMobile;

