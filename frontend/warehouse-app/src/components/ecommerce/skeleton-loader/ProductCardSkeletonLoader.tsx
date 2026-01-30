"use client";
import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";
import { ecommerceData } from "@/data/ecommerceData";

const ProductCardSkeletonLoader = React.forwardRef<HTMLDivElement>((props, ref) => (
  <Card 
    ref={ref}
    sx={{ 
      borderRadius: ecommerceData.ui.spacing.cardBorderRadius, 
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    {/* Image Container with Discount Badge */}
    <Box
      sx={{
        position: "relative",
        height: { xs: 160, sm: 180 },
        overflow: "hidden",
        bgcolor: "#f3f4f6",
      }}
    >
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="100%"
        sx={{ 
          borderRadius: 0,
        }} 
      />
      {/* Discount Badge Skeleton */}
      <Skeleton
        variant="rectangular"
        width={50}
        height={18}
        sx={{
          position: "absolute",
          top: { xs: 6, sm: 8 },
          left: { xs: 6, sm: 8 },
          borderRadius: 0.5,
          bgcolor: "#e0e7ff",
        }}
      />
    </Box>

    <CardContent sx={{ p: { xs: 1, sm: 1.25 }, pb: { xs: 0.75, sm: 1 }, pt: { xs: 1.5, sm: 1.25 }, "&:last-child": { pb: { xs: 0.75, sm: 1 } } }}>
      {/* Quantity Badge */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 0.5, sm: 0.5 }, minHeight: { xs: 20, sm: "auto" } }}>
        <Skeleton 
          variant="rectangular" 
          width={70} 
          height={16} 
          sx={{ 
            borderRadius: 1,
            bgcolor: "#eff6ff",
          }} 
        />
      </Box>

      {/* Product Name */}
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
        width="90%" 
        height={20} 
        sx={{ 
          mb: { xs: 0.5, sm: 0.25 },
          display: { xs: "none", sm: "block" },
        }} 
      />

      {/* Description */}
      <Skeleton 
        variant="text" 
        width="80%" 
        height={16} 
        sx={{ 
          mb: { xs: 0, sm: 1 },
          display: { xs: "none", sm: "block" },
        }} 
      />

      {/* Price and Add Button */}
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 1, mt: { xs: 0.5, sm: 0 } }}>
        <Box sx={{ flex: 1 }}>
          {/* Current Price */}
          <Skeleton 
            variant="text" 
            width={90} 
            height={24} 
            sx={{ 
              mb: 0.5,
            }} 
          />
          {/* Original Price (strikethrough) */}
          <Skeleton 
            variant="text" 
            width={70} 
            height={14} 
            sx={{ 
              mt: 0.25,
              opacity: 0.5,
            }} 
          />
        </Box>
        {/* Add Button */}
        <Skeleton 
          variant="rectangular" 
          width={{ xs: 32, sm: 80 }} 
          height={{ xs: 32, sm: 36 }} 
          sx={{ 
            borderRadius: 1,
            border: "1.5px solid #e5e7eb",
          }} 
        />
      </Box>
    </CardContent>
  </Card>
));

ProductCardSkeletonLoader.displayName = 'ProductCardSkeletonLoader';

export default ProductCardSkeletonLoader;