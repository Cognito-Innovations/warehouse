"use client";

import React from "react";
import { Paper, Typography, Box, Checkbox } from "@mui/material";
import { CartItemsListProps } from "@/types/ecommerce";
import CartItemCard from "./CartItemCard";

export default function CartItemsList({
  items,
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

  const isItemSelected = (item: any) => {
    return selectedItems.has(item.product_id);
  };

  const allSelected = items.length > 0 && items.every(isItemSelected);
  const someSelected = items.some(isItemSelected);

  const getKey = (item: any) => item?.product_id;

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
        const key = getKey(item);
        return (
          <CartItemCard
            key={key}
            item={item}
            isSelected={isItemSelected(item)}
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

