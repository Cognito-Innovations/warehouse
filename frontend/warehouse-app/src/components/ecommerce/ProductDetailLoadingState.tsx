"use client";

import React from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Skeleton,
  Paper,
} from "@mui/material";
import { ecommerceData } from "@/data/ecommerceData";

export default function ProductDetailLoadingState() {
  return (
    <Box sx={{ bgcolor: ecommerceData.ui.colors.productDetailBackground, minHeight: "100vh" }}>
      {/* Header Skeleton */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
        <Toolbar>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={150} height={28} sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
          {/* Product Image Section Skeleton */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 50%" } }}>
            <Paper sx={{ p: 2, borderRadius: ecommerceData.ui.spacing.searchBorderRadius }}>
              <Box sx={{ position: "relative" }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={400}
                  sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius }}
                />

                {/* Overlay Skeletons */}
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={32}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    borderRadius: ecommerceData.ui.spacing.cardBorderRadius,
                  }}
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={32}
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    borderRadius: ecommerceData.ui.spacing.cardBorderRadius,
                  }}
                />
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={24}
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    borderRadius: ecommerceData.ui.spacing.cardBorderRadius,
                  }}
                />
              </Box>

              {/* Preview Thumbnails Skeleton */}
              <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "center" }}>
                {[...Array(3)].map((_, index) => (
                  <Box key={index} sx={{ width: 80, minHeight: 100 }}>
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={50}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    />
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="80%" height={16} />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Product Info Section Skeleton */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 50%" } }}>
            <Paper sx={{ p: 3, borderRadius: ecommerceData.ui.spacing.searchBorderRadius }}>
              {/* Product Name */}
              <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />

              {/* Price Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={100} height={32} />
                <Skeleton variant="text" width={80} height={28} />
              </Box>

              {/* Selected Quantity */}
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />

              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 2 }} />
              </Box>

              {/* Special Offers */}
              <Box sx={{ mb: 3 }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={80}
                  sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius, mb: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={60}
                  sx={{ borderRadius: ecommerceData.ui.spacing.cardBorderRadius }}
                />
              </Box>

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="95%" height={20} />
              </Box>

              {/* Delivery Info */}
              <Box sx={{ mb: 3 }}>
                <Skeleton variant="text" width={200} height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="75%" height={20} />
              </Box>

              {/* Add to Cart Button */}
              <Skeleton
                variant="rectangular"
                width="100%"
                height={56}
                sx={{ borderRadius: ecommerceData.ui.spacing.searchBorderRadius }}
              />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

