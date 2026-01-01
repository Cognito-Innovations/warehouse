"use client";
import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";
import { ecommerceData } from "@/data/ecommerceData";

export default function ProductCardSkeletonLoader() {
  return (
    <Card sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius, overflow: "hidden" }}>
      <Skeleton variant="rectangular" width="100%" height={180} />
      <CardContent sx={{ p: { xs: 1, sm: 1.25 }, pb: { xs: 0.75, sm: 1 }, pt: { xs: 1.5, sm: 1.25 }, "&:last-child": { pb: { xs: 0.75, sm: 1 } } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 0.5, sm: 0.5 }, minHeight: { xs: 20, sm: "auto" } }}>
          <Skeleton variant="rectangular" width={60} height={16} sx={{ borderRadius: 0.5 }} />
        </Box>
        <Skeleton 
          variant="text" 
          width="100%" 
          height={20} 
          sx={{ 
            mb: { xs: 0.5, sm: 0.25 },
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
          }} 
        />
        <Skeleton 
          variant="text" 
          width="80%" 
          height={16} 
          sx={{ 
            mb: { xs: 0, sm: 1 },
            display: { xs: "none", sm: "block" },
          }} 
        />
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 1, mt: { xs: 0.5, sm: 0 } }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="text" width={60} height={14} sx={{ mt: 0.25 }} />
          </Box>
          <Skeleton 
            variant="rectangular" 
            width={{ xs: 32, sm: 80 }} 
            height={{ xs: 32, sm: 36 }} 
            sx={{ borderRadius: 1 }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
}