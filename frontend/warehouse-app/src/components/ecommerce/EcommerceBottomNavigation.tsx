"use client";

import React from "react";
import { BottomNavigation, BottomNavigationAction, Badge } from "@mui/material";
import { ShoppingCart, Receipt, AccountCircle } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { EcommerceBottomNavigationProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";

export default function EcommerceBottomNavigation({
  cartItemCount,
}: EcommerceBottomNavigationProps) {
  const router = useRouter();
  return (
    <BottomNavigation
      showLabels
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: `1px solid ${ecommerceData.ui.colors.borderColor}`,
        zIndex: 1000,
        display: { xs: "flex", md: "none" },
      }}
    >
      <BottomNavigationAction
        label="Cart"
        icon={
          <Badge badgeContent={cartItemCount} color="error">
            <ShoppingCart
              sx={{
                color: cartItemCount > 0 ? ecommerceData.ui.colors.bottomNavCart : ecommerceData.ui.colors.bottomNavDefault,
              }}
            />
          </Badge>
        }
        onClick={() => router.push(ROUTES.CART)}
      />
      <BottomNavigationAction
        label="Orders"
        icon={<Receipt sx={{ color: ecommerceData.ui.colors.bottomNavDefault }} />}
      />
      <BottomNavigationAction
        label="Account"
        icon={<AccountCircle sx={{ color: ecommerceData.ui.colors.bottomNavDefault }} />}
      />
    </BottomNavigation>
  );
}

