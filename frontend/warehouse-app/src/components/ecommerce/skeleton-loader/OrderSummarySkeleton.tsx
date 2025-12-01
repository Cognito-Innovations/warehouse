import React from "react";
import { Paper, Box, Skeleton } from "@mui/material";

interface OrderSummarySkeletonProps {
  borderColor?: string;
}

export default function OrderSummarySkeleton({ borderColor }: OrderSummarySkeletonProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
      }}
    >
      <Skeleton variant="text" width={120} height={24} sx={{ mb: 2, fontWeight: 600 }} />
      {["subtotal", "delivery", "taxes", "service", "total"].map((key, i) => (
        <Box
          key={key}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1.5,
            ...(i === 4 && { pt: 1, mt: 2, borderTop: "1px solid #eee" }),
          }}
        >
          <Skeleton variant="text" width={80} height={16} />
          <Skeleton variant="text" width={50} height={16} />
        </Box>
      ))}
      <Skeleton variant="rectangular" height={48} sx={{ mt: 2, borderRadius: 1 }} />
    </Paper>
  );
}