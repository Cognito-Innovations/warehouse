import React from "react";
import { Box, Typography } from "@mui/material";
import { formatDateTime } from "@/lib/utils";
import { statusConfig } from "@/lib/pickupStatus";
import { PickupRequest } from "./PickupRequestCard";

interface PickupRequestCardDesktopProps {
  request: PickupRequest;
}

const PickupRequestCardDesktop: React.FC<PickupRequestCardDesktopProps> = ({ request }) => {
  const statusKey = (request.status || "REQUESTED").toUpperCase();
  const { color, icon } = statusConfig[statusKey] || statusConfig.REQUESTED;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 3,
      }}
    >
      {/* Request No & Date */}
      <Box sx={{ flexShrink: 0, width: "15%", minWidth: 120 }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary", mb: 0.5 }}>
          {request.request_no || `PR/${request.country}/${request.id.substring(0, 8)}`}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(request.created_at)}
        </Typography>
      </Box>

      {/* Pickup Location */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Pickup Location
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            wordBreak: "break-word",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {request.pickup_address}
        </Typography>
      </Box>

      {/* Supplier */}
      <Box sx={{ flexShrink: 0, width: "18%", minWidth: 140 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          Supplier
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
          {request.supplier_name}
        </Typography>
      </Box>

      {/* Status */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "10%",
          minWidth: 100,
        }}
      >
        {icon}
        <Typography variant="body2" sx={{ fontWeight: 600, color, mt: 0.5 }}>
          {request.status?.toUpperCase()}
        </Typography>
      </Box>

      {/* Action CTA */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "12%",
          minWidth: 100,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "#9333EA",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          View Details
        </Typography>
      </Box>
    </Box>
  );
};

export default PickupRequestCardDesktop;

