"use client";

import React from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Skeleton,
  Alert,
  Button,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { EcommerceSkeletonLoaderProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";
import GridSkeletonLoader from "./GridSkeletonLoader";
import CategorySkeletonLoader from "./CategorySkeletonLoader";

export default function EcommerceSkeletonLoader({
  networkError,
  refreshButtonLabel,
  onRefresh,
}: EcommerceSkeletonLoaderProps) {
  return (
    <Box sx={{ bgcolor: ecommerceData.ui.colors.background, minHeight: "100vh" }}>
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
            xl: ecommerceData.ui.spacing.containerMaxWidth,
          },
          mx: "auto",
        }}
      >
        {/* Warning Banner - Only show when there's an error */}
        {networkError && refreshButtonLabel && onRefresh && (
          <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
            <Alert
              severity="warning"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={onRefresh}
                  startIcon={<Refresh />}
                >
                  {refreshButtonLabel}
                </Button>
              }
              sx={{ mb: 2 }}
            >
              {networkError}
            </Alert>
          </Box>
        )}

        {/* Promotional Cards Skeleton */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 4, sm: 6, md: 8 },
            flexWrap: "wrap",
            borderBottom: "1px solid #d3d2d2",
            pb: { xs: 2, sm: 2.5, md: 3 },
            mb: 2,
            mt: 5,
          }}
        >
          {[...Array(3)].map((_, index) => (
            <Box
              key={`promotional-card-${index}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: { xs: "80px", sm: "100px", md: "120px" },
              }}
            >
              <Box
                sx={{
                  width: { xs: 44, sm: 52, md: 60 },
                  height: { xs: 44, sm: 52, md: 60 },
                  borderRadius: 2.5,
                  bgcolor: "#ede9fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="70%"
                  height="70%"
                  sx={{ borderRadius: 1 }}
                />
              </Box>

              {/* Label */}
              <Skeleton
                variant="text"
                width={80}
                height={20}
                sx={{
                  mb: 0.5,
                  fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Section 1: Today's Deal Skeleton */}
        <Box sx={{ bgcolor: "white", px: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }} />
          <GridSkeletonLoader count={5} />
        </Box>
        <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />

        {/* Section 2: Suggested for You Skeleton */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
          <GridSkeletonLoader count={5} hasTitle={true} titleWidth={180} />
        </Box>
        <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />
        {/* Section 3: Products by Category Skeleton */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
          <CategorySkeletonLoader numCategories={2} />
        </Box>
        {/* Bottom Navigation Skeleton - Mobile Only */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: `1px solid ${ecommerceData.ui.colors.borderColor}`,
            bgcolor: "white",
            display: { xs: "flex", md: "none" },
            justifyContent: "space-around",
            alignItems: "center",
            py: 1,
            zIndex: 1000,
          }}
        >
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={40} height={12} />
            </Box>
          ))}
        </Box>
      </Container >
    </Box >
  );
}

