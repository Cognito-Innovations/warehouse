import React from "react";
import { CircularProgress } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { getStatusProps } from "@/lib/statusUtils";
import { formatDateTime } from "@/lib/utils";
import ExpandedPackageSection from "../../Tabs/ExpandedPackageSection";
import PackageActions from "./PackageActions";

interface PackageTableRowProps {
    pkg: any;
    isSelected: boolean;
    isExpanded: boolean;
    isUploading: boolean;
    onSelect: () => void;
    onUpload: () => void;
    onToggleExpand: () => void;
}

const PackageTableRow: React.FC<PackageTableRowProps> = ({
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

    return (
        <React.Fragment>
            <tr
                className={`group transition-all duration-200 ${
                    isSelected ? "bg-purple-50/50" : "hover:bg-gray-50/80"
                }`}
            >
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer disabled:opacity-30"
                        checked={isSelected}
                        onChange={onSelect}
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
                        <div
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit ${colorClassName} bg-opacity-10 font-bold`}
                        >
                            <IconComponent className="text-[14px]" />
                            <span className="uppercase text-[9px] sm:text-[10px] tracking-wider">
                                {status}
                            </span>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                            {pkg.customer_name || pkg.user?.name}
                        </span>
                    </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800">
                            {pkg.weight || pkg.total_weight} KG
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                            {pkg.package_count || 1} items
                        </span>
                    </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                    <div className="flex justify-end items-center gap-3">
                        <PackageActions
                            packageId={pkg.id}
                            documents={pkg.documents || []}
                            isUploading={isUploading}
                            isExpanded={isExpanded}
                            onUpload={onUpload}
                            onToggleExpand={onToggleExpand}
                        />
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                        <ExpandedPackageSection documents={pkg.documents || []} />
                        {pkg.remarks && (
                            <div className="mt-2 text-sm text-gray-600 font-medium">
                                <span className="text-gray-400 uppercase text-[10px] tracking-wider block">
                                    Remarks
                                </span>
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
};

export default PackageTableRow;

