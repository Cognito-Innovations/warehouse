"use client";

import React from "react";
import { Box } from "@mui/material";
import Sidebar from "@/components/ecommerce/sidebar/Sidebar";
import Footer from "../components/Common/Footer";
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
    <Box sx={{ bgcolor: ecommerceData.ui.colors.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Sidebar open={isSidebarOpen} onClose={onSidebarClose} />

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: "100%",
          mx: "auto",
          p: 0, 
          flex: 1,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}