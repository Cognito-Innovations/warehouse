"use client";

import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceCategorySectionProps } from "@/types/ecommerce";

export default function EcommerceCategorySection({
  title,
  categories,
  selectedCategory,
  onCategoryChange,
  forYouLabel,
}: EcommerceCategorySectionProps) {
  return (
    <Box
      sx={{
        bgcolor: "white",
        px: 2,
        py: 1,
        borderBottom: `1px solid ${ecommerceData.ui.colors.borderColor}`,
      }}
    >
      {/* <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        {title}
      </Typography> */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flex: 1,
            overflowX: "auto",
            overflowY: "hidden",
            pr: 1,
            whiteSpace: "nowrap",
            // Modern scrollbar styling - subtle and unnoticeable
            "&::-webkit-scrollbar": {
              height: "2px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0, 0, 0, 0.15)",
              borderRadius: "2px",
              "&:hover": {
                background: "rgba(0, 0, 0, 0.25)",
              },
            },
            // Firefox scrollbar
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.15) transparent",
          }}
        >
          <Chip
            label={forYouLabel}
            onClick={() => onCategoryChange(null)}
            variant={selectedCategory === null ? "filled" : "outlined"}
            color={selectedCategory === null ? "primary" : "default"}
            sx={{
              fontWeight: 600,
              borderColor: "primary.main",
              "&:hover": {
                bgcolor: selectedCategory === null ? "primary.main" : "action.hover",
                borderColor: "primary.main",
              },
            }}
          />
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => onCategoryChange(category.id)}
              variant={selectedCategory === category.id ? "filled" : "outlined"}
              color={selectedCategory === category.id ? "primary" : "default"}
              sx={{
                fontWeight: 600,
                borderColor: "primary.main",
                "&:hover": {
                  bgcolor: selectedCategory === category.id ? "primary.main" : "action.hover",
                  borderColor: "primary.main",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

