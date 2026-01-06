"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { getPickupRequestsByUser } from "@/lib/api.service";
import { useSession } from "next-auth/react";
import EmptyState from "@/components/Tabs/EmptyState";
import PickupRequestCard from "@/components/PickupRequest/PickupRequestCard";
import PickupRequestHeader from "@/components/PickupRequest/PickupRequestHeader";

export default function PickupRequestPage() {
  const { data: session, status } = useSession();
  const [pickupRequests, setPickupRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const user_id = (session?.user as any)?.user_id;

  const fetchData = useCallback(async () => {
    if (!user_id) return;
    try {
      setLoading(true);
      const data = await getPickupRequestsByUser(user_id);
      setPickupRequests(data);
    } catch (err) {
      console.error("Failed to fetch pickup requests:", err);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    if (status === "loading") return;
    fetchData();
  }, [fetchData, status]);

  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) return pickupRequests;
    const searchLower = searchTerm.toLowerCase();
    return pickupRequests.filter(
      (req) =>
        req.request_no?.toLowerCase().includes(searchLower) ||
        req.pickup_address?.toLowerCase().includes(searchLower) ||
        req.supplier_name?.toLowerCase().includes(searchLower) ||
        req.status?.toLowerCase().includes(searchLower)
    );
  }, [pickupRequests, searchTerm]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PickupRequestHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredRequests.length > 0 ? (
          <Box>
            {filteredRequests.map((req) => (
              <PickupRequestCard key={req.id} request={req} />
            ))}
          </Box>
        ) : (
          <EmptyState
            icon={<ReceiptLongIcon sx={{ fontSize: "inherit" }} />}
            message={searchTerm ? "No pickup requests match your search" : "No Pickup Requests Found"}
          />
        )}
      </div>
    </main>
  );
} 