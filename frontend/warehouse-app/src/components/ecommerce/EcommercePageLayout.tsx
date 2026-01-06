"use client";

import React, { useState } from "react";
import { Box, Container } from "@mui/material";

// import EcommerceBottomNavigation from "@/components/ecommerce/EcommerceBottomNavigation";
import Sidebar from "@/components/ecommerce/sidebar/Sidebar";
import { ecommerceData } from "@/data/ecommerceData";

interface EcommercePageLayoutProps {
  children: React.ReactNode;
}

export default function EcommercePageLayout({
  children,
}: EcommercePageLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Box sx={{ bgcolor: ecommerceData.ui.colors.background, minHeight: "100vh" }}>
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
        {children}

      </Container>
    </Box>
  );
}