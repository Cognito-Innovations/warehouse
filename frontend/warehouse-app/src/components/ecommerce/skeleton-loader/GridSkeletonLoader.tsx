"use client";
import React from "react";
import { Box, Skeleton } from "@mui/material";
import ProductCardSkeletonLoader from "./ProductCardSkeletonLoader";
import { ecommerceData } from "@/data/ecommerceData";

interface GridSkeletonProps {
  count: number;
  hasTitle?: boolean;
  titleWidth?: number;
}

export default function GridSkeletonLoader({ count, hasTitle = false, titleWidth = 150 }: GridSkeletonProps) {
  return (
    <>
      {hasTitle && (
        <Skeleton variant="text" width={titleWidth} height={28} sx={{ mb: 2 }} />
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: `repeat(${ecommerceData.ui.grid.columns.xs}, 1fr)`,
            sm: `repeat(${ecommerceData.ui.grid.columns.sm}, 1fr)`,
            md: `repeat(${ecommerceData.ui.grid.columns.md}, 1fr)`,
            lg: `repeat(${ecommerceData.ui.grid.columns.lg}, 1fr)`,
          },
          gap: 2,
        }}
      >
        {[...Array(count)].map((_, index) => (
          <ProductCardSkeletonLoader key={index} />
        ))}
      </Box>
    </>
  );
}