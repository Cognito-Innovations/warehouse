"use client";

import { Box, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { formatDateTime } from "@/lib/utils";

interface TrackingStatusProps {
  status: string;
  createdAt: string;
}

const TRACKING_STEPS = [
  { label: "Ship Request", defaultDescription: "Requested by User" },
  { label: "Payment Pending", defaultDescription: "Waiting for confirmation!" },
  { label: "Payment Approved", defaultDescription: "Waiting for payment approval" },
  { label: "Ready To Ship", defaultDescription: "Waiting for ready to ship" },
];

const STATUS_UI_MAP = new Map([
  ["departed", "Ready To Ship"],
  ["request ship", "Ship Request"]
]);

const TrackingStatus: React.FC<TrackingStatusProps> = ({ status, createdAt }) => {
  const normalizedStatus = status.toLowerCase();
  const effectiveStatus = STATUS_UI_MAP.get(normalizedStatus) || status;

  const currentStepIndex = TRACKING_STEPS.findIndex(
    (step) => step.label.toLowerCase() === effectiveStatus.toLowerCase()
  );

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Tracking
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {TRACKING_STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex;

          const description = isCompleted
            ? formatDateTime(createdAt)
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

                {index < TRACKING_STEPS.length - 1 && (
                  <Box
                    sx={{
                      flexGrow: 1,
                      width: "2px",
                      backgroundColor: isCompleted && index < currentStepIndex ? "#3B82F6" : "#E0E0E0",
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