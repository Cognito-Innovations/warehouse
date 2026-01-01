"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    LocalShipping as ShipmentIcon
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

import { getShipmentsByUser } from "@/lib/api.service";
import { formatDateTime } from "@/lib/utils";
import { getStatusProps } from "@/lib/statusUtils";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/contexts/AuthContext";
import EmptyState from "../Tabs/EmptyState";
import SearchAndFilter from "../Tabs/SearchAndFilter";

const ShipmentsContent = () => {
    const { user } = useAuth();
    const { data: session } = useSession();
    const router = useRouter();

    const [shipments, setShipments] = useState<any[]>([]);
    const [shipmentsLoading, setShipmentsLoading] = useState(false);
    const [shipmentSearchTerm, setShipmentSearchTerm] = useState("");
    const [shipmentFilter, setShipmentFilter] = useState<string>("all");

    const fetchData = async () => {
        const userId = (session?.user as any)?.user_id;
        if (!userId) return;

        setShipmentsLoading(true);
        try {
            const ships = await getShipmentsByUser(userId);
            setShipments(ships);
        } catch (error) {
            toast.error("Failed to fetch shipments");
        } finally {
            setShipmentsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [(session?.user as any)?.user_id, user?.id]);


    const filteredShipments = shipments.filter((shipment) => {
        const matchesSearch = shipment.shipment_no.toLowerCase().includes(shipmentSearchTerm.toLowerCase());
        const matchesFilter = shipmentFilter === "all" || shipment.status.toLowerCase() === shipmentFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100 space-y-4">
                <SearchAndFilter
                    searchTerm={shipmentSearchTerm}
                    onSearchChange={setShipmentSearchTerm}
                    selectedFilter={shipmentFilter}
                    onFilterChange={setShipmentFilter}
                    placeholder="Search shipments..."
                />
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
                    <thead className="bg-gray-50/95 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                Shipment No
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                Created Date
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {shipmentsLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <CircularProgress size={32} className="text-purple-600" />
                                </td>
                            </tr>
                        ) : filteredShipments.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <EmptyState icon={<ShipmentIcon />} message="No Shipments Found" />
                                </td>
                            </tr>
                        ) : (
                            filteredShipments.map((shipment) => {
                                const { IconComponent, colorClassName } = getStatusProps(shipment.status);
                                return (
                                    <tr
                                        key={shipment.id}
                                        className="group hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
                                        onClick={() => router.push(`${ROUTES.SHIPMENT}/${shipment.shipment_no}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                                            {shipment.shipment_no}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            {formatDateTime(shipment.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${colorClassName} bg-opacity-10 font-bold`}>
                                                <IconComponent className="text-[14px]" />
                                                <span className="uppercase text-[9px] sm:text-[10px] tracking-wider">{shipment.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-purple-600 group-hover:underline">
                                            View Details
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default ShipmentsContent;
