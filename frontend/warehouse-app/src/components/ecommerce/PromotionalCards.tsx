"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { ShoppingCart, LocalDining, Percent } from "@mui/icons-material";
import { PromotionalCardsProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";

export default function PromotionalCards({
  categories,
  onCategoryFilter,
  selectedCategory,
}: PromotionalCardsProps) {
  // Define promotional card data with icons and labels
  const promotionalData = [
    {
      id: "grocery-deals",
      label: "Grocery Deals",
      icon: ShoppingCart,
      iconBgColor: "#7c3aed", // Dark pink/magenta (matches image)
      defaultCategoryId: categories[0]?.id || null,
    },
    {
      id: "dairy-bakery",
      label: "Dairy and Bakery",
      icon: LocalDining,
      iconBgColor: "#7c3aed", // Very light pink
      defaultCategoryId: categories[1]?.id || null,
    },
    {
      id: "mega-saving",
      label: "Mega Saving Zone",
      icon: Percent,
      iconBgColor: "#7c3aed", // Very light pink
      defaultCategoryId: categories[2]?.id || null,
    },
  ];

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
        flexWrap: "wrap",
        borderBottom: "1px solid #d3d2d2",
        pb: { xs: -2, sm: -2.5, md: -3 },
      }}
    >
      {promotionalData.map((card, index) => {
        const isActive = selectedCategory === card.defaultCategoryId || 
                        (index === 0 && !selectedCategory); // First card active by default
        
        return (
          <Box
            key={card.id}
            onClick={() => handleCardClick(card.defaultCategoryId)}
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
            }}
          >
            {/* Icon with rounded background */}
            <Box
              sx={{
                width: { xs: 44, sm: 52, md: 60 },
                height: { xs: 44, sm: 52, md: 60 },
                borderRadius: 2.5,
                bgcolor: isActive ? card.iconBgColor : "#ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
                boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {/* TODO: Pickup images from backend url */}
              {index === 0 ? (
                <img
                  src="https://rukminim2.flixcart.com/fk-p-flap/108/108/image/dd3b92bbefa3870d.png?q=60"
                  alt="Promotional"
                  style={{
                    width: "70%",
                    height: "70%",
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "transparent",
                  }}
                />
              ) : index === 1 ? (
                <img
                  src="https://rukminim2.flixcart.com/fk-p-flap/108/108/image/3e83480a9b183ed7.png?q=60"
                  alt="Promotional"
                  style={{
                    width: "70%",
                    height: "70%",
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "transparent",
                  }}
                />
              ) : index === 2 ? (
                <img
                  src="https://rukminim2.flixcart.com/fk-p-flap/108/108/image/eb75e5d9571bde1a.png?q=60"
                  alt="Promotional"
                  style={{
                    width: "70%",
                    height: "70%",
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "transparent",
                  }}
                />
              ) : null}
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
              }}
            >
              {card.label}
            </Typography>
            
            {/* Active state indicator */}
            {isActive && (
              <Box
                sx={{
                  width: "110%",
                  height: 4,
                  bgcolor: card.iconBgColor,
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

