"use client";

import React from "react";
import { Paper, Typography, Box, Checkbox } from "@mui/material";
import { CartItemsListProps } from "@/types/ecommerce";
import CartItemCard from "./CartItemCard";

export default function CartItemsList({
  items,
  loadingStates,
  selectedItems,
  onItemSelect,
  onSelectAll,
  onQuantityChange,
  onRemoveItem,
  title,
  discountBadgeColor,
  borderColor,
  currencySymbol,
  selectedCountry,
}: CartItemsListProps) {
  const allSelected = items.length > 0 && items.every((item) => selectedItems.has(item.id));
  const someSelected = items.some((item) => selectedItems.has(item.id));

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, 
        mb: 2, 
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          sx={{
            color: "success.main",
            "&.Mui-checked": {
              color: "success.main",
            },
          }}
        />
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      
      {items.map((item) => {
        const loadingState = loadingStates[item.id] || {
          isIncrementLoading: false,
          isDecrementLoading: false,
          isRemoveLoading: false,
        };

        return (
          <CartItemCard
            key={item.id}
            item={item}
            loadingState={loadingState}
            isSelected={selectedItems.has(item.id)}
            onSelect={onItemSelect}
            onQuantityChange={onQuantityChange}
            onRemoveItem={onRemoveItem}
            discountBadgeColor={discountBadgeColor}
            borderColor={borderColor}
            currencySymbol={currencySymbol}
            selectedCountry={selectedCountry}
          />
        );
      })}
    </Paper>
  );
}

