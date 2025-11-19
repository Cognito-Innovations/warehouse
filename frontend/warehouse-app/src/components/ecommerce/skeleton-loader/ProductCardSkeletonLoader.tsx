"use client";
import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";
import { ecommerceData } from "@/data/ecommerceData";

export default function ProductCardSkeletonLoader() {
  return (
    <Card sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius, overflow: "hidden" }}>
      <Skeleton variant="rectangular" width="100%" height={180} />
      <CardContent sx={{ p: 2, pb: "1 !important" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, justifyContent: "space-between", mb: 1 }}>
          <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={50} height={16} />
          </Box>
        </Box>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="100%" height={32} sx={{ mb: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Skeleton variant="text" width={60} height={20} />
            <Skeleton variant="text" width={50} height={16} />
          </Box>
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );
}