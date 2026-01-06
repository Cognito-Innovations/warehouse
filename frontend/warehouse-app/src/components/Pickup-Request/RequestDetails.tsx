"use client";

import { Paper, Typography, Box, Chip } from "@mui/material";
import { formatDateTime } from "@/lib/utils";

interface RequestDetailsProps {
  details: any;
}

export default function RequestDetails({ details }: RequestDetailsProps) {
  const status = details.status.toUpperCase();
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 2.5,
        borderRadius: 2,
        border: "1px solid #E0E0E0",
        backgroundColor: "#fff",
      }}
    >
    <Box sx={{ 
      display: "grid", 
      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
      gap: { xs: 2, sm: 2, md: 1 },
      mb: { xs: 2, md: 1 }
    }}>
        <Box>
          <Typography variant="body2" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" } }}>
            {details.request_no || `PR/IN/${details.id.substring(0, 8)}`}
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" } }}>
            {formatDateTime(details.created_at)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            Request From
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" } }}>
            {details.country || "India"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            Supplier
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" } }}>
            {details.supplier_name}
          </Typography>
        </Box>
    </Box>

    <Box sx={{ 
      display: "grid", 
      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
      gap: { xs: 2, sm: 2, md: 1 },
      mb: 2 
    }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            Supplier Contact
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" }, wordBreak: "break-word" }}>
            {[details.supplier_phone_number, details.alt_supplier_phone_number]
              .filter(Boolean)
              .join(" / ")
            }
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            No. of Box/PCS
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" } }}>
            {details.pcs_box || "—"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            Est Weight
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" } }}>
            {details.est_weight ? `${details.est_weight}kg` : "—"}
          </Typography>
        </Box>
    </Box>

    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, mb: 0.5 }}>
        Pickup Location
      </Typography>
      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" }, wordBreak: "break-word" }}>
        {details.pickup_address}
      </Typography>
    </Box>
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, mb: 0.5 }}>
        Package Details
      </Typography>
      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" }, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
        {details.pkg_details}
      </Typography>
    </Box>

    <Box>
      <Typography variant="body2" color="text.secondary">
        Status
      </Typography>
      <Chip
        label={status}
        sx={{
          mt: 0.5,
          fontWeight: "bold",
          textTransform: "uppercase",
          backgroundColor:
            status === "REQUESTED"
              ? "#FF9800"
              : status === "QUOTED"
              ? "#4CAF50"
              : status === "PICKED" || status === "CONFIRMED"
              ? "#4CAF50"
              : status === "CANCELLED"
              ? "#EF4444"
              : "#9E9E9E",
          color: "#fff",
        }}
      />
    </Box>
    </Paper>
  );
}