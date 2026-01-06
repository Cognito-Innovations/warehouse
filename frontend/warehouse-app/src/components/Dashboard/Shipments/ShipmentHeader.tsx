import React from "react";

interface ShipmentHeaderProps {
    title?: string;
}

const ShipmentHeader: React.FC<ShipmentHeaderProps> = ({
    title = "Shipments",
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
                {title}
            </h2>
        </div>
    );
};

export default ShipmentHeader;

