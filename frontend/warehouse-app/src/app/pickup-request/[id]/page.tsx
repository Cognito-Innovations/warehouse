"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deletePickupRequest, getPickupRequestById, updatePickupRequestStatus } from "@/lib/api.service";
import TrackingStatus from "@/components/Pickup-Request/TrackingStatus";
import RequestDetails from "@/components/Pickup-Request/RequestDetails";
import QuotedPriceCard from "@/components/Pickup-Request/QuotedPriceCard";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";

export default function ViewRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [details, setDetails] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const NON_DELETABLE_STATUSES = ["CONFIRMED", "PICKED"];

  const fetchData = async () => {
    try {
      const data = await getPickupRequestById(id as string);
      setDetails(data);
    } catch (err) {
      console.error("Failed to fetch request details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await updatePickupRequestStatus(details.id, "CONFIRMED");
      await fetchData();
    } catch (err) {
      console.error("Failed to confirm:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      setConfirmOpen(false);
      setLoading(true);
      await deletePickupRequest(details.id);
      router.push("/pickup-request");
    } catch (err) {
      console.error("Failed to delete request:", err);
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!details) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h6">Request not found</Typography>
        <Button onClick={() => router.push("/pickup-request")} sx={{ mt: 2 }}>
          Back to Requests
        </Button>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-100">
      <Box className="max-w-7xl mx-auto px-4 py-6">

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <Link href="/pickup-request" style={{ textDecoration: "none", color: "#3B82F6", fontWeight: 500 }}>
            Pickup Requests
          </Link>{" "}
          / <strong>View Request</strong>
        </Typography>

        <Paper
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor:
              details.status.toUpperCase() === "CANCELLED" ? "#FEE2E2" : "#E8F0FE",
          }}
          elevation={0}
        >
          <Typography
            variant="body2"
            color={details.status.toUpperCase() === "CANCELLED" ? "error.main" : "text.primary"}
          >
            {details.status.toUpperCase() === "CANCELLED"
              ? "Your request has been cancelled or rejected."
              : "Your request has been received. We will get back to you shortly."}
          </Typography>
        </Paper>

        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <RequestDetails details={details} />

            {details.status.toUpperCase() === "QUOTED" && (
              <QuotedPriceCard price={details.price} />
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
              {!NON_DELETABLE_STATUSES.includes(details.status.toUpperCase()) && (        
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setConfirmOpen(true)}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Delete Request
                </Button>
              )}

              {details.status.toUpperCase() === "QUOTED" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirm}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Confirm
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ width: 300 }}>
            <TrackingStatus details={details} />
          </Box>

          <ConfirmDialog
            open={confirmOpen}
            title="Delete Pickup Request"
            message="Are you sure you want to delete this request? This action cannot be undone."
            confirmText="Delete"
            onConfirm={handleDelete}
            onClose={() => setConfirmOpen(false)}
            isLoading={isDeleting}
          />
        </Box>
      </Box>
    </Box>
  );
}
