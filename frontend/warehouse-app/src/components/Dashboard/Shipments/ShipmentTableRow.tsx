import React from "react";
import { useRouter } from "next/navigation";
import { getStatusProps } from "@/lib/statusUtils";
import { formatDateTime } from "@/lib/utils";
import { ROUTES } from "@/utils/constants";

interface ShipmentTableRowProps {
    shipment: any;
}

const ShipmentTableRow: React.FC<ShipmentTableRowProps> = ({ shipment }) => {
    const router = useRouter();
    const { IconComponent, colorClassName } = getStatusProps(shipment.status);

    const handleClick = () => {
        router.push(`${ROUTES.SHIPMENT}/${shipment.shipment_no}`);
    };

    return (
        <tr
            className="group hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
            onClick={handleClick}
        >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                {shipment.shipment_no}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                {formatDateTime(shipment.created_at)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${colorClassName} bg-opacity-10 font-bold`}
                >
                    <IconComponent className="text-[14px]" />
                    <span className="uppercase text-[9px] sm:text-[10px] tracking-wider">
                        {shipment.status}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-purple-600 group-hover:underline">
                View Details
            </td>
        </tr>
    );
};

export default ShipmentTableRow;

