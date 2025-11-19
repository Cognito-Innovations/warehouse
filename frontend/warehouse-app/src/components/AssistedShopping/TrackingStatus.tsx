"use client";

import { Box, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { formatDateTime } from "@/lib/utils";

interface TrackingStatusProps {
  trackingRequests: any[];
  createdAt: string;  
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({ trackingRequests, createdAt }) => {
    const TRACKING_STEPS = [
    { label: "Requested", defaultDescription: "Requested by User" },
    { label: "Quotation Ready", defaultDescription: "Quotation is not ready yet!" },
    { label: "Quotation Confirmed", defaultDescription: "Quotation is not confirmed yet!" },
    { label: "Invoiced", defaultDescription: "Waiting for confirmation!" },
    { label: "Pending Payment Approval", defaultDescription: "Waiting for confirmation!" },
    { label: "Payment Approved", defaultDescription: "Waiting for payment approval" },
    { label: "Order Placed", defaultDescription: "Waiting for complete" },
  ];

  const STATUS_MAPPING: Record<string, string> = {
    REQUESTED: "Requested",
    QUOTED: "Quotation Ready",
    QUOTATION_READY: "Quotation Ready",
    QUOTATION_CONFIRMED: "Quotation Confirmed",
    INVOICED: "Invoiced",
    PAYMENT_PENDING: "Pending Payment Approval",
    PAYMENT_APPROVED: "Payment Approved",
    ORDER_PLACED: "Order Placed",
  };

  const completedSteps = trackingRequests.map(
    (track) => STATUS_MAPPING[track.status.toUpperCase()]
  );

  const lastCompletedIndex = TRACKING_STEPS.findIndex(
    (step) => step.label === completedSteps[completedSteps.length - 1]
  );

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Tracking
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {TRACKING_STEPS.map((step, index) => {
          const historyItem = trackingRequests.find(
            (track) =>
              STATUS_MAPPING[track.status.toUpperCase()]?.toLowerCase() ===
              step.label.toLowerCase()
          );

          const fallbackItem =
            step.label === "Quotation Confirmed"
              ? trackingRequests.find((track) => track.status.toUpperCase() === "INVOICED")
              : undefined;

          const effectiveItem = historyItem || fallbackItem;

          const isCompleted = Boolean(effectiveItem);
          const isLastCompleted = index === lastCompletedIndex;

          const description = effectiveItem
            ? formatDateTime(effectiveItem.created_at)
            : step.defaultDescription;

          return (
            <Box key={step.label} sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mr: 2,
                }}
              >
                {isCompleted ? (
                  <CheckCircle sx={{ color: "#3B82F6", zIndex: 1 }} />
                ) : (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "2px solid #BDBDBD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: isCompleted ? "#3B82F6" : "#BDBDBD",
                      }}
                    />
                  </Box>
                )}

                {index < TRACKING_STEPS.length - 1 && (
                  <Box
                    sx={{
                      flexGrow: 1,
                      width: "2px",
                      backgroundColor: isCompleted ? "#3B82F6" : "#E0E0E0",
                      minHeight: 24,
                    }}
                  />
                )}
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isCompleted ? "#3B82F6" : "#424242",
                  }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isCompleted ? "#3B82F6" : "text.secondary",
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default TrackingStatus;