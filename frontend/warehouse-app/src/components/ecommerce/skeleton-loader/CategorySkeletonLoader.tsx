"use client";
import React from "react";
import { Box } from "@mui/material";
import GridSkeletonLoader from "./GridSkeletonLoader";

interface CategorySkeletonProps {
  numCategories?: number;
}

export default function CategorySkeletonLoader({ numCategories = 2 }: CategorySkeletonProps) {
  return (
    <>
      {[...Array(numCategories)].map((_, catIndex) => (
        <Box key={catIndex} sx={{ mb: 4 }}>
          <GridSkeletonLoader count={5} hasTitle={true} titleWidth={150} />
        </Box>
      ))}
    </>
  );
}