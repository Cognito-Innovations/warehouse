import React from "react";
import { CircularProgress } from "@mui/material";
import {
    Upload as UploadIcon,
    Visibility as ViewIcon,
    ExpandMore,
    ExpandLess,
} from "@mui/icons-material";

interface Document {
    id: string;
    document_name: string;
    document_url: string;
    category: string;
}

interface PackageActionsProps {
    packageId: string;
    documents: Document[];
    isUploading: boolean;
    isExpanded: boolean;
    onUpload: () => void;
    onToggleExpand: () => void;
}

const PackageActions: React.FC<PackageActionsProps> = ({
    packageId,
    documents,
    isUploading,
    isExpanded,
    onUpload,
    onToggleExpand,
}) => {
    const hasDocuments = documents && documents.length > 0;

    return (
        <div className="flex items-center gap-2">
            {hasDocuments ? (
                <button
                    onClick={onToggleExpand}
                    className="text-purple-600 hover:text-purple-800 hover:underline transition-all flex items-center gap-1 text-xs sm:text-sm font-medium"
                >
                    <ViewIcon className="text-[16px]" />
                    <span>{isExpanded ? "Hide Docs" : `View Docs (${documents.length})`}</span>
                </button>
            ) : (
                <button
                    onClick={onUpload}
                    disabled={isUploading}
                    className={`${
                        isUploading
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-purple-600 hover:text-purple-800 hover:underline"
                    } transition-all flex items-center gap-1 text-xs sm:text-sm font-medium`}
                >
                    {isUploading ? (
                        <>
                            <CircularProgress size={14} className="text-purple-600" />
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <UploadIcon className="text-[16px]" />
                            <span>Upload Docs</span>
                        </>
                    )}
                </button>
            )}
            <button
                onClick={onToggleExpand}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                aria-label={isExpanded ? "Collapse" : "Expand"}
            >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </button>
        </div>
    );
};

export default PackageActions;

