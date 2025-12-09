"use client";

import React from "react";
import { Paper, Typography, Box, Checkbox } from "@mui/material";
import { CartItemsListProps } from "@/types/ecommerce";
import CartItemCard from "./CartItemCard";
import { useCartStore } from "@/store/cartStore";

export default function CartItemsList({
  items,
  selectedItems,
  currencyInfo,
  selectedCountry,
}: CartItemsListProps) {

  const {
    cartProducts,
    checkoutProducts,
    toggleCartItemSelection,
    clearCheckoutProducts,
  } = useCartStore();

  const isItemSelected = (item: any) => {
    return selectedItems.has(item.product_id);
  };

  const allSelected = items.length > 0 && items.every(isItemSelected);
  const someSelected = items.some(isItemSelected);

  const getKey = (item: any) => item?.product_id;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = cartProducts
        .map(i => i.product_id)
        .filter((id): id is string => !!id);

      const unselectedIds = allIds.filter(id => !checkoutProducts.includes(id));
      if (unselectedIds.length > 0) {
        toggleCartItemSelection(unselectedIds);
      }
    } else {
      clearCheckoutProducts();
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, 
        mb: 2, 
        borderRadius: 2,
        border: `1px solid #e0e0e0`,
        bgcolor: "white",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
          sx={{
            color: "success.main",
            "&.Mui-checked": {
              color: "success.main",
            },
          }}
        />
        <Typography variant="h6" fontWeight="bold">
          Shopping Cart
        </Typography>
      </Box>
      
      {items.map((item) => {
        const key = getKey(item);
        return (
          <CartItemCard
            key={key}
            item={item}
            isSelected={isItemSelected(item)}
            currencyInfo={currencyInfo!}
            selectedCountry={selectedCountry}
          />
        );
      })}
    </Paper>
  );
}

