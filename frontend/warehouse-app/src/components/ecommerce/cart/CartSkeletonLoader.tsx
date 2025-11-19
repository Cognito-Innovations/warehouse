"use client";

import React from "react";
import { Box, Container, Skeleton, Paper } from "@mui/material";

export default function CartSkeletonLoader() {
  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      {/* Header Skeleton */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={200} height={32} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Cart Items Section Skeleton */}
          <Box sx={{ flex: { md: "0 0 65%" }, width: { xs: "100%", md: "65%" } }}>
            {/* Address Selection Skeleton */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Skeleton variant="text" width={200} height={24} sx={{ mb: 1.5 }} />
              <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
            </Paper>

            {/* Cart Items List Skeleton */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={150} height={28} />
              </Box>

              {/* Cart Item Skeleton */}
              {[1, 2].map((item) => (
                <Box key={item} sx={{ display: "flex", gap: 2, mb: 2, pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mt: 0.5 }} />
                  <Skeleton variant="rectangular" width={140} height={140} sx={{ borderRadius: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1.5 }} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="text" width={32} height={24} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                    <Skeleton variant="circular" width={36} height={36} />
                    <Skeleton variant="text" width={80} height={32} />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Box>

          {/* Order Summary Skeleton */}
          <Box sx={{ flex: { md: "0 0 35%" }, width: { xs: "100%", md: "35%" } }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 3 }} />
              <Box sx={{ mb: 3 }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Box key={item} sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={60} height={20} />
                  </Box>
                ))}
                <Skeleton variant="rectangular" width="100%" height={1} sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton variant="text" width={60} height={28} />
                  <Skeleton variant="text" width={80} height={28} />
                </Box>
              </Box>
              <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

