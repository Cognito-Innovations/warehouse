"use client";

import React, { useState } from "react";
import { Box, Container } from "@mui/material";

import { useCartStore } from "@/store/cartStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommerceHeader from "@/components/ecommerce/EcommerceHeader";
// import EcommerceBottomNavigation from "@/components/ecommerce/EcommerceBottomNavigation";
import Sidebar from "@/components/ecommerce/sidebar/Sidebar";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceCategory } from "@/types/ecommerce";

interface EcommercePageLayoutProps {
  locationData: ReturnType<typeof useEffectiveUserLocation>;
  categories: EcommerceCategory[];
  children: React.ReactNode;
}

export default function EcommercePageLayout({
  locationData,
  categories,
  children,
}: EcommercePageLayoutProps) {
  const { cartProductQuantityCount } = useCartStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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
        <EcommerceHeader
          locationData={locationData}
          cartItemCount={cartProductQuantityCount()}
          onMenuClick={toggleSidebar}
        />

        {children}

        {/* TODO: Uncomment when functionality added */}
        {/* <EcommerceBottomNavigation cartItemCount={cartProductQuantityCount()} /> */}
      </Container>
    </Box>
  );
}