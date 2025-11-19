"use client";

import React from "react";
import { Box, Container } from "@mui/material";

import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommerceHeader from "@/components/ecommerce/EcommerceHeader";
import PromotionalCards from "@/components/ecommerce/PromotionalCards";
import EcommerceBottomNavigation from "@/components/ecommerce/EcommerceBottomNavigation";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceCategory } from "@/types/ecommerce";
import { useCart } from "@/store/ecommerceStore";

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
  const { itemCount } = useCart();
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
        <EcommerceHeader
          locationData={locationData}
          cartItemCount={itemCount}
        />

        {/* Today's Deals Section with Promotional Cards */}
        <Box
          sx={{
            bgcolor: "white",
            pt: { xs: 2.5, sm: 3, md: 3.5 },
            pb: { xs: 2, sm: 2.5, md: 3 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <PromotionalCards categories={categories} />
        </Box>

        {children}

        <EcommerceBottomNavigation cartItemCount={itemCount} />
      </Container>
    </Box>
  );
}