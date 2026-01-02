import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { formatDateTime } from "@/lib/utils";
import { statusConfig } from "@/lib/pickupStatus";

interface PickupRequest {
  id: string;
  request_no?: string;
  created_at: string;
  pickup_address: string;
  supplier_name: string;
  status: string;
}

interface PickupRequestCardMobileProps {
  request: PickupRequest;
}

const PickupRequestCardMobile: React.FC<PickupRequestCardMobileProps> = ({ request }) => {
  const statusKey = (request.status || "REQUESTED").toUpperCase();
  const { color, icon } = statusConfig[statusKey] || statusConfig.REQUESTED;

  return (
    <Box>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary", mb: 0.5 }}>
            {request.request_no || `PR/IN/${request.id.substring(0, 8)}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(request.created_at)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
          {icon}
          <Typography variant="caption" sx={{ fontWeight: 600, color, fontSize: "0.7rem" }}>
            {request.status?.toUpperCase()}
          </Typography>
        </Box>
      </Box>

      {/* Pickup Location */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Pickup Location
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            wordBreak: "break-word",
          }}
        >
          {request.pickup_address}
        </Typography>
      </Box>

      {/* Supplier */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Supplier
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
          {request.supplier_name}
        </Typography>
      </Box>

      {/* Action CTA */}
      <Box sx={{ pt: 2, borderTop: "1px solid #E5E7EB" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#9333EA" }}>
            View Details
          </Typography>
          <ArrowForward sx={{ color: "#9333EA", fontSize: "18px" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default PickupRequestCardMobile;

