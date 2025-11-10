"use client";

import React from "react";
import { BottomNavigation, BottomNavigationAction, Badge } from "@mui/material";
import { ShoppingCart, Receipt, AccountCircle } from "@mui/icons-material";
import { EcommerceBottomNavigationProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";

export default function EcommerceBottomNavigation({
  cartItemCount,
  cartLabel,
  ordersLabel,
  accountLabel,
  onCartClick,
}: EcommerceBottomNavigationProps) {
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
        label={cartLabel}
        icon={
          <Badge badgeContent={cartItemCount} color="error">
            <ShoppingCart
              sx={{
                color: cartItemCount > 0 ? ecommerceData.ui.colors.bottomNavCart : ecommerceData.ui.colors.bottomNavDefault,
              }}
            />
          </Badge>
        }
        onClick={onCartClick}
      />
      <BottomNavigationAction
        label={ordersLabel}
        icon={<Receipt sx={{ color: ecommerceData.ui.colors.bottomNavDefault }} />}
      />
      <BottomNavigationAction
        label={accountLabel}
        icon={<AccountCircle sx={{ color: ecommerceData.ui.colors.bottomNavDefault }} />}
      />
    </BottomNavigation>
  );
}

