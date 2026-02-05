import React from "react";
import { useRouter } from "next/navigation";
import { getStatusProps } from "@/lib/statusUtils";
import { formatDateTime } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";
import { ArrowForward } from "@mui/icons-material";

interface ShipmentCardMobileProps {
    shipment: any;
}

const ShipmentCardMobile: React.FC<ShipmentCardMobileProps> = ({ shipment }) => {
    const router = useRouter();
    const { IconComponent, colorClassName } = getStatusProps(shipment.status);

    const handleClick = () => {
        router.push(`${ROUTES.SHIPMENT}/${shipment.shipment_no}`);
    };

    return (
        <div
            onClick={handleClick}
            className="border border-gray-200 rounded-lg p-4 transition-all duration-200 bg-white hover:shadow-md cursor-pointer active:bg-gray-50"
        >
            {/* Shipment No - Primary Info */}
            <div className="mb-4">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
                    Shipment No
                </div>
                <div className="text-base font-bold text-gray-900">
                    {shipment.shipment_no}
                </div>
            </div>

            {/* Status - Secondary Info */}
            <div className="mb-4">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
                    Status
                </div>
                <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${colorClassName} bg-opacity-10 font-bold`}
                >
                    <IconComponent className="text-[14px]" />
                    <span className="uppercase text-[10px] tracking-wider">{shipment.status}</span>
                </div>
            </div>

            {/* Created Date - Secondary Info */}
            <div className="mb-4">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">
                    Created Date
                </div>
                <div className="text-sm font-semibold text-gray-700">
                    {formatDateTime(shipment.created_at)}
                </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-purple-600">View Details</span>
                    <ArrowForward className="text-purple-600 text-[18px]" />
                </div>
            </div>
        </div>
    );
};

export default ShipmentCardMobile;

