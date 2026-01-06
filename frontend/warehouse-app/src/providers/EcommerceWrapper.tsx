"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import Sidebar from "@/components/ecommerce/sidebar/Sidebar";
import { ecommerceData } from "@/data/ecommerceData";

interface EcommerceWrapperProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  onSidebarClose: () => void;
  onMenuClick?: () => void;
}

export default function EcommerceWrapper({
  children,
  isSidebarOpen,
  onSidebarClose,
}: EcommerceWrapperProps) {
  return (
    <Box sx={{ bgcolor: ecommerceData.ui.colors.background, minHeight: "100vh" }}>
      <Sidebar open={isSidebarOpen} onClose={onSidebarClose} />

      <Container
        maxWidth="xl"
        sx={{
          maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: "100%", xl: ecommerceData.ui.spacing.containerMaxWidth },
          mx: "auto",
        }}
      >
        {children}
      </Container>
    </Box>
  );
}