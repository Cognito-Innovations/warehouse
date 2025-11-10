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
  Card,
  CardContent,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { EcommerceSkeletonLoaderProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";

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
        {/* Header Skeleton - Matches EcommerceHeader layout */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
          <Toolbar sx={{ justifyContent: "space-around", gap: { xs: 1, sm: 2 }, flexWrap: { xs: "wrap", md: "nowrap" }, py: { xs: 1, sm: 1.5 } }}>
            {/* Logo */}
            <Skeleton variant="text" width={120} height={40} sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }} />
            
            {/* Search Bar - Middle */}
            <Box sx={{ flex: 1, order: { xs: 3, md: 2 }, width: { xs: "100%", md: "auto" }, maxWidth: { xs: "100%", sm: "400px", md: "500px" }, mx: { xs: 0, sm: 2 } }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                sx={{ borderRadius: ecommerceData.ui.spacing.searchBorderRadius }}
              />
            </Box>

            {/* Location and Cart - Right */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, order: { xs: 2, md: 3 } }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={180} height={20} sx={{ display: { xs: "none", sm: "block" } }} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </Toolbar>
        </AppBar>

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
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
            p: 2,
            bgcolor: "white",
          }}
        >
          {[...Array(3)].map((_, index) => (
            <Card key={index} sx={{ borderRadius: 2, minHeight: 180 }}>
              <CardContent sx={{ p: 2 }}>
                <Skeleton variant="text" width="70%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Category Selection Skeleton */}
        <Box
          sx={{
            bgcolor: "white",
            px: 2,
            py: 1,
            borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flex: 1,
                overflowX: "auto",
                overflowY: "hidden",
                pr: 1,
                whiteSpace: "nowrap",
              }}
            >
              <Skeleton
                variant="rectangular"
                width={60}
                height={32}
                sx={{ borderRadius: 2 }}
              />
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={100}
                  height={32}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Section 1: Today's Deal Skeleton */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
          <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
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
            {[...Array(5)].map((_, index) => (
              <Card key={index} sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius, overflow: "hidden" }}>
                <Skeleton variant="rectangular" width="100%" height={180} />
                <CardContent sx={{ p: 2, pb: 1 }}>
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
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={32}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
        <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />

        {/* Section 2: Suggested for You Skeleton */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
          <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
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
            {[...Array(5)].map((_, index) => (
              <Card key={index} sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius, overflow: "hidden" }}>
                <Skeleton variant="rectangular" width="100%" height={180} />
                <CardContent sx={{ p: 2, pb: 1 }}>
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
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={32}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
        <Box sx={{ borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`, my: 2 }} />

        {/* Section 3: Products by Category Skeleton */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
          {[...Array(2)].map((_, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: 4 }}>
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
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
                {[...Array(5)].map((_, index) => (
                  <Card key={index} sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius, overflow: "hidden" }}>
                    <Skeleton variant="rectangular" width="100%" height={180} />
                    <CardContent sx={{ p: 2, pb: 1 }}>
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
                        <Skeleton
                          variant="rectangular"
                          width={80}
                          height={32}
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}
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
      </Container>
    </Box>
  );
}

