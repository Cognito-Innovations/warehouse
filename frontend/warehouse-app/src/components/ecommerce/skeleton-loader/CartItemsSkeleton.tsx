import React from "react";
import { Box, Paper, Skeleton } from "@mui/material";

interface CartItemsSkeletonProps {
  borderColor?: string;
}

export default function CartItemsSkeleton({ borderColor }: CartItemsSkeletonProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
      }}
    >
      <Skeleton variant="text" width={150} height={24} sx={{ mb: 2, fontWeight: 600 }} />
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", py: 1.5, borderBottom: "1px solid #eee" }}>
            <Skeleton variant="rectangular" width={60} height={60} sx={{ mr: 2, borderRadius: 1 }} />
            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="40%" height={16} sx={{ mb: 1, fontSize: "0.875rem", color: "text.secondary" }} />
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Skeleton variant="rectangular" width={40} height={20} sx={{ mr: 2, borderRadius: 4 }} />
                  <Skeleton variant="text" width={60} height={20} />
                </Box>
            </Box>
          </Box>
        ))}
    </Paper>
  )
};