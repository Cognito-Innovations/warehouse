"use client";

import { Box, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { formatDateTime } from "@/lib/utils";

interface TrackingStatusProps {
  details: any;
}

export default function TrackingStatus({ details }: TrackingStatusProps) {
  const TRACKING_STEPS = [
    { label: "Requested", defaultDescription: "Awaiting confirmation" },
    { label: "Quotation Ready", defaultDescription: "Quotation is not ready yet!" },
    { label: "Confirmed", defaultDescription: "Waiting for user confirmation!" },
    { label: "Picked", defaultDescription: "Package has not been picked up yet." },
  ];

  const STATUS_MAPPING: Record<string, string> = {
    REQUESTED: "Requested",
    QUOTED: "Quotation Ready",
    CONFIRMED: "Confirmed",
    PICKED: "Picked",
  };
  
  const trackingRequests = details?.tracking_requests || [];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Tracking
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {TRACKING_STEPS.map((step, index) => {
          const historyItem = trackingRequests.find(
            (track: any) =>
              STATUS_MAPPING[track.status.toUpperCase()]?.toLowerCase() ===
              step.label.toLowerCase()
          );

          const isCompleted = Boolean(historyItem);

          const description = historyItem
            ? formatDateTime(historyItem.created_at)
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
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "2px solid #BDBDBD",
                      backgroundColor: "background.paper",
                      zIndex: 1,
                    }}
                  />
                )}

                {index < TRACKING_STEPS.length - 1 && (
                  <Box
                    sx={{
                      width: "2px",
                      mt: "-4px",
                      height: "32px",
                      backgroundColor: isCompleted ? "#3B82F6" : "#E0E0E0",
                    }}
                  />
                )}
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isCompleted ? "#3B82F6" : "text.primary",
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
}