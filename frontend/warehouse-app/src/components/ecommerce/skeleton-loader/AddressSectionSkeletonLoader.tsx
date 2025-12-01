"use client";
import React from "react";
import { Paper, Skeleton } from "@mui/material";

interface AddressSectionSkeletonLoaderProps {
  borderColor: string;
}

export default function AddressSectionSkeletonLoader({
  borderColor,
}: AddressSectionSkeletonLoaderProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
        position: "relative",
      }}
    >
      <Skeleton
        variant="circular"
        width={24}
        height={24}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      />
      <Skeleton
        variant="text"
        width={120}
        height={20}
        sx={{ mb: 1.5, fontSize: "0.95rem" }}
      />
      <Skeleton
        variant="text"
        width={200}
        height={24}
        sx={{ mb: 0.5 }}
      />
      <Skeleton
        variant="text"
        width="100%"
        height={20}
        sx={{ mb: 0.5 }}
      />
      <Skeleton
        variant="text"
        width={150}
        height={16}
        sx={{ mb: 0.25 }}
      />
      <Skeleton
        variant="text"
        width={150}
        height={16}
      />
    </Paper>
  );
}