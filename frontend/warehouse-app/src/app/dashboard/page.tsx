"use client";

import TabsSection from "../../components/Tabs/TabsSection";
import WarningBanner from "../../components/WarningBanner/WarningBanner";
import ProtectedRoute from "../../providers/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {!user?.verified && <WarningBanner />}
          <TabsSection />
        </div>
      </div>
    </ProtectedRoute>
  );
}