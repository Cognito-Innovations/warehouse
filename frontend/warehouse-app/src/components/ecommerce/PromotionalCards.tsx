"use client";

import React, { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { PromotionalCardsProps } from "@/types/ecommerce";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import GridViewIcon from '@mui/icons-material/GridView';

import { useProductActions, useProducts } from "@/store/ecommerceStore";

export default function PromotionalCards({
  categories,
}: PromotionalCardsProps) {
  const { selectedCategory } = useProducts();
  const { setSelectedCategory } = useProductActions();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 112; 
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const iconBgColor = "#7c3aed";
  const isAllActive = !selectedCategory;

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          gap: { xs: 4, sm: 6, md: 8 },
          flexWrap: "nowrap",
          overflowX: "auto",
          borderBottom: "1px solid #d3d2d2",
          pb: { xs: -2, sm: -2.5, md: -3 },
          "::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: 'smooth',
        }}
      >
        <Box
          onClick={() => handleCardClick('')}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            transition: "transform 0.2 ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
            },
            minWidth: { xs: "80px", sm: "100px", md: "120px" },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: { xs: 44, sm: 52, md: 60 },
              height: { xs: 44, sm: 52, md: 60 },
              borderRadius: 2.5,
              bgcolor: isAllActive ? iconBgColor : "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
              boxShadow: isAllActive ? "0 2px 12px rgba(0,0,0,0.12)" : "none",
              transition: "all 0.2s ease-in-out",
              overflow: "hidden",
            }}
          >
            <GridViewIcon
              sx={{
                fontSize: { xs: 24, sm: 28, md: 32 },
                color: isAllActive ? "white" : iconBgColor,
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontWeight: isAllActive ? 700 : 500,
              color: "#333",
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
              textAlign: "center",
              mb: 0.5,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            All
          </Typography>

          {isAllActive && (
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

        {categories.map((category, index) => {
          const isActive = selectedCategory === category.id;
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

      <IconButton
        onClick={handleScroll}
        sx={{
          position: 'absolute',
          right: { xs: -10, md: -20 }, 
          top: { xs: '6px', md: '15px' },
          zIndex: 2,
          width: { xs: 32, md: 40 },
          height: { xs: 32, md: 40 },
          borderRadius: '50%',
          display: 'inline-flex', 
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 1)',
          },
        }}
      >
        <ArrowForwardIosIcon
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: '#4B5563',
            ml: { xs: '2px', md: '3px' }
          }}
        />
      </IconButton>
    </Box>
  );
}

