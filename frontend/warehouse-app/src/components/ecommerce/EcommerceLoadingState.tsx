"use client";

import React from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Skeleton,
  Card,
  CardContent,
} from "@mui/material";
import { EcommerceLoadingStateProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";

export default function EcommerceLoadingState({ loadingMessage }: EcommerceLoadingStateProps) {
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
        {/* Header Skeleton */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
          <Toolbar>
            <Skeleton variant="text" width={120} height={40} sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={180} height={20} />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Search Bar Skeleton */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            sx={{ borderRadius: ecommerceData.ui.spacing.searchBorderRadius }}
          />
        </Box>

        {/* Category Navigation Skeleton */}
        <Box
          sx={{
            bgcolor: "white",
            px: 2,
            py: 1,
            borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`,
          }}
        >
          <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton
                variant="rectangular"
                width={80}
                height={32}
                sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius }}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={32}
                sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius }}
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={32}
                sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius }}
              />
            </Box>
            <Skeleton variant="circular" width={40} height={40} sx={{ ml: 2 }} />
          </Box>
        </Box>

        {/* Products Grid Skeleton */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
          <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
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
            {[...Array(ecommerceData.ui.skeleton.productCardCount)].map((_, index) => (
              <Card key={index} sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius, overflow: "hidden" }}>
                <Skeleton variant="rectangular" width="100%" height={180} />
                <CardContent sx={{ p: 2, pb: 1 }}>
                  <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Skeleton variant="text" width={60} height={20} />
                    <Skeleton
                      variant="rectangular"
                      width={70}
                      height={28}
                      sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Skeleton variant="circular" width={14} height={14} />
                    <Skeleton variant="text" width={50} height={16} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

