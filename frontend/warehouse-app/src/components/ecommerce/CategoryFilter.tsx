"use client";

import React from "react";
import {
  Box,
  Chip,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { EcommerceCategory } from "../../types/ecommerce";

//TODO: Generated temprorarily need to look requirment and change
interface CategoryFilterProps {
  categories: EcommerceCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Categories
      </Typography>
      
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          overflowX: isMobile ? "auto" : "visible",
          pb: isMobile ? 1 : 0,
          "&::-webkit-scrollbar": {
            height: 4,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 2,
          },
        }}
      >
        <Chip
          label="All"
          onClick={() => onCategoryChange(null)}
          variant={selectedCategory === null ? "filled" : "outlined"}
          color={selectedCategory === null ? "primary" : "default"}
          sx={{
            fontWeight: 600,
            minWidth: 80,
            "&:hover": {
              bgcolor: selectedCategory === null ? "primary.main" : "action.hover",
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
              minWidth: 100,
              "&:hover": {
                bgcolor: selectedCategory === category.id ? "primary.main" : "action.hover",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
