"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { LocalShipping as ShipmentIcon } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

import { getShipmentsByUser } from "@/lib/api.service";
import { useAuth } from "@/contexts/AuthContext";
import EmptyState from "../Tabs/EmptyState";
import SearchAndFilter from "../Tabs/SearchAndFilter";
import ShipmentHeader from "./Shipments/ShipmentHeader";
import ShipmentCardMobile from "./Shipments/ShipmentCardMobile";
import ShipmentTableRow from "./Shipments/ShipmentTableRow";

const ShipmentsContent = () => {
    const { user } = useAuth();
    const { data: session } = useSession();

    const [shipments, setShipments] = useState<any[]>([]);
    const [shipmentsLoading, setShipmentsLoading] = useState(false);
    const [shipmentSearchTerm, setShipmentSearchTerm] = useState("");
    const [shipmentFilter, setShipmentFilter] = useState<string>("all");

    const userId = (session?.user as any)?.user_id;

    const fetchData = useCallback(async () => {
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
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const filteredShipments = shipments.filter((shipment) => {
        const matchesSearch = shipment.shipment_no.toLowerCase().includes(shipmentSearchTerm.toLowerCase());
        const matchesFilter = shipmentFilter === "all" || shipment.status.toLowerCase() === shipmentFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <ShipmentHeader title="Ship the packages" />

            <div className="p-4 border-b border-gray-100">
                <SearchAndFilter
                    searchTerm={shipmentSearchTerm}
                    onSearchChange={setShipmentSearchTerm}
                    selectedFilter={shipmentFilter}
                    onFilterChange={setShipmentFilter}
                    placeholder="Search shipments..."
                />
            </div>

            {/* Mobile Card */}
            <div className="md:hidden max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 p-4 space-y-3">
                {shipmentsLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <CircularProgress size={32} className="text-purple-600" />
                    </div>
                ) : filteredShipments.length === 0 ? (
                    <div className="py-12">
                        <EmptyState icon={<ShipmentIcon />} message="No Shipments Found" />
                    </div>
                ) : (
                    filteredShipments.map((shipment) => (
                        <ShipmentCardMobile key={shipment.id} shipment={shipment} />
                    ))
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
                    <thead className="bg-gray-50/95 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                            >
                                Shipment No
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                            >
                                Created Date
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-right text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                            >
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
                            filteredShipments.map((shipment) => (
                                <ShipmentTableRow key={shipment.id} shipment={shipment} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ShipmentsContent;
