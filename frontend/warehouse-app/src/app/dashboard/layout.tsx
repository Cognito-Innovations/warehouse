"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/providers/ProtectedRoute";
import ProfileAlert from "@/components/WarningBanner/WarningBanner";
import { useAddressAPI } from "@/hooks/useAddressAPI";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { selectedAddress } = useAddressAPI();
    const pathname = usePathname();

    const navItems = [
        { label: "Packages", href: "/dashboard/packages" },
        { label: "Shipments", href: "/dashboard/shipments" },
    ];

    const getPageTitle = () => {
        if (pathname.includes("/packages")) return "Packages";
        if (pathname.includes("/shipments")) return "Shipments";
        return "Dashboard";
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {!selectedAddress?.id && <ProfileAlert />}

                    {/* Simple Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                    </div>

                    <main>{children}</main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
