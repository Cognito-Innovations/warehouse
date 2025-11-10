"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { PromotionalCardsProps } from "@/types/ecommerce";

export default function PromotionalCards({
  categories,
  onCategoryFilter,
  selectedCategory,
}: PromotionalCardsProps) {
  const handleCardClick = (categoryId: string | null) => {
    if (categoryId) {
      onCategoryFilter(categoryId);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 4, sm: 6, md: 8 },
        flexWrap: "nowwrap",
        overflowX: "auto",
        borderBottom: "1px solid #d3d2d2",
        pb: { xs: -2, sm: -2.5, md: -3 },
        "::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {categories.map((category, index) => {
        const isActive = selectedCategory === category.id || 
                        (index === 0 && !selectedCategory); // First card active by default
        const iconBgColor = "#7c3aed";
        
        return (
          <Box
            key={category.id}
            onClick={() => handleCardClick(category.id)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
              },
              minWidth: { xs: "80px", sm: "100px", md: "120px" },
              flexShrink: 0,
            }}
          >
            {/* Icon with rounded background */}
            <Box
              sx={{
                width: { xs: 44, sm: 52, md: 60 },
                height: { xs: 44, sm: 52, md: 60 },
                borderRadius: 2.5,
                bgcolor: isActive ? iconBgColor : "#ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
                boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.2s ease-in-out",
                overflow: "hidden",
              }}
            >
              <img
                src={category.image_url || 'https://rukminim2.flixcart.com/fk-p-flap/108/108/image/eb75e5d9571bde1a.png?q=60'}
                onError={(e) => (e.currentTarget.src = "https://rukminim2.flixcart.com/fk-p-flap/108/108/image/eb75e5d9571bde1a.png?q=60")}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </Box>
            
            {/* Label */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: isActive ? 700 : 500,
                color: "#333",
                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                textAlign: "center",
                mb: 0.5,
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {category.name}
            </Typography>
            
            {/* Active state indicator */}
            {isActive && (
              <Box
                sx={{
                  width: "110%",
                  height: 4,
                  bgcolor: iconBgColor,
                  borderRadius: 2,
                  mt: 0.5,
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

