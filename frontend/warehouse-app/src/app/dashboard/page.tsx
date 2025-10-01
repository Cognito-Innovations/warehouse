"use client";

import TabsSection from "../../components/Tabs/TabsSection";
import ProfileAlert from "../../components/WarningBanner/WarningBanner";
import ProtectedRoute from "../../providers/ProtectedRoute";
import { useAddressAPI } from "@/hooks/useAddressAPI";

export default function DashboardPage() {
  const {selectedAddress} =  useAddressAPI();
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {!selectedAddress?.id && <ProfileAlert />}
          <TabsSection />
        </div>
      </div>
    </ProtectedRoute>
  );
}