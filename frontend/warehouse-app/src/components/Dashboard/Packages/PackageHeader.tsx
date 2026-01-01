import React from "react";
import { CircularProgress } from "@mui/material";

interface PackageHeaderProps {
    selectedCount: number;
    isRequestingShip: boolean;
    onRequestShip: () => void;
    onShareOTP: () => void;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({
    selectedCount,
    isRequestingShip,
    onRequestShip,
    onShareOTP,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
                Ready to Send Packages
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto shrink-0">
                {selectedCount > 0 && (
                    <button
                        onClick={onRequestShip}
                        disabled={isRequestingShip}
                        className="inline-flex bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white items-center justify-center px-3 sm:px-4 py-2 transition-all ease-in-out border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md focus:outline-none whitespace-nowrap"
                    >
                        {isRequestingShip ? (
                            <>
                                <CircularProgress size={14} className="mr-2 text-white" />
                                <span>Requesting...</span>
                            </>
                        ) : (
                            <span>Request Ship ({selectedCount})</span>
                        )}
                    </button>
                )}

                <button
                    onClick={onShareOTP}
                    className="inline-flex bg-purple-600 hover:bg-purple-700 text-white items-center justify-center px-3 sm:px-4 py-2 transition-all ease-in-out border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md focus:outline-none whitespace-nowrap"
                >
                    Share OTP
                </button>
            </div>
        </div>
    );
};

export default PackageHeader;

