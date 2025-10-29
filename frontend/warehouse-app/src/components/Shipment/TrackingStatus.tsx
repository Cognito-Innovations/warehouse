"use client";

import { Box, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { formatDateTime } from "@/lib/utils";

const TRACKING_STEPS = [
  { id: "ship_request", label: "Ship Request", defaultDescription: "Requested by User" },
  { id: "payment_pending", label: "Payment Pending", defaultDescription: "Waiting for confirmation!" },
  { id: "payment_approved", label: "Payment Approved", defaultDescription: "Payment approved" },
  { id: "ready_to_ship", label: "Ready To Ship", defaultDescription: "Ready to ship" },
  { id: "departed", label: "Departed", defaultDescription: "Departed from origin" },
];

const STEP_ID_MAP: Record<string, string> = {
  "ship_request": "ship_request",
  "payment_pending": "payment_pending",
  "payment_approved": "payment_approved",
  "ready_to_ship": "ready_to_ship",
  "departed": "departed",
};

interface TrackingStatusProps {
  trackingRequests?: any[];
  status: string;
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({ trackingRequests = [], status }) => {
  const trackingHistory = trackingRequests;

  const stepStatuses = TRACKING_STEPS.map((step) => {
    const historyItem = trackingHistory.find(
      (track: any) => track.status === step.id
    );
    const date = historyItem ? formatDateTime(historyItem.created_at) : undefined;
    const description = date || step.defaultDescription;
    const isComplete = !!historyItem;
    return {
      ...step,
      description,
      isComplete,
    };
  });

  let currentStepIndex = -1;
  const normalizedShipmentStatus = status.toLowerCase();
  const mappedStepId = STEP_ID_MAP[normalizedShipmentStatus];
  if (mappedStepId) {
    currentStepIndex = TRACKING_STEPS.findIndex((step) => step.id === mappedStepId);
  }
  if (currentStepIndex === -1) {
    const completedIndices = trackingHistory.map((track: any) => {
      const idx = TRACKING_STEPS.findIndex((step) => step.id === track.status);
      return idx >= 0 ? idx : -1;
    }).filter((i) => i >= 0);
    if (completedIndices.length > 0) {
      currentStepIndex = Math.max(...completedIndices);
    } else {
      currentStepIndex = 0;
    }
  }

  const currentId = stepStatuses[currentStepIndex]?.id;

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Tracking
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {stepStatuses.map((step, index) => {
          const isCompleted = step.isComplete;
          const isActive = step.id === currentId;
          const isPastOrCurrent = index <= currentStepIndex;
          const textColor = isPastOrCurrent ? "#3B82F6" : "#424242";
          const captionColor = isPastOrCurrent ? "#3B82F6" : "text.secondary";
          const lineColor = index < currentStepIndex ? "#3B82F6" : "#E0E0E0";

          return (
            <Box key={step.id} sx={{ display: "flex", alignItems: "flex-start" }}>
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
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#BDBDBD",
                      }}
                    />
                  </Box>
                )}

                {index < stepStatuses.length - 1 && (
                  <Box
                    sx={{
                      flexGrow: 1,
                      width: "2px",
                      backgroundColor: lineColor,
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
                    color: textColor,
                  }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: captionColor,
                  }}
                >
                  {step.description}
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