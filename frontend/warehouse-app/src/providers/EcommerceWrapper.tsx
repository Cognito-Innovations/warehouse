"use client";

import React from "react";
import { Box } from "@mui/material";
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

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: "100%",
          mx: "auto",
          p: 0, 
        }}
      >
        {children}
      </Box>
    </Box>
  );
}