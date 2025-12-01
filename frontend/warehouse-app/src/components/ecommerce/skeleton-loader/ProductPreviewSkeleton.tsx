import React from "react";
import { Box, Skeleton } from "@mui/material";

export default function ProductPreviewSkeleton() {
  const items = Array.from({ length: 3 });

  return (
    <>
      {items.map((_, index) => (
        <Box key={index} sx={{ width: 80, height: 100 }}>
          <Skeleton 
            variant="rounded" 
            width={80} 
            height={50} 
            sx={{ mb: 0.5, borderRadius: 1 }} 
          />
          <Skeleton 
            variant="text" 
            width={60} 
            height={15} 
            sx={{ mx: "auto" }} 
          />
          <Skeleton 
            variant="text" 
            width={40} 
            height={15} 
            sx={{ mx: "auto" }} 
          />
        </Box>
      ))}
    </>
  );
}