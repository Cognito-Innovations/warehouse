"use client";

import React from "react";
import { Box, Card, CardContent, Typography, Button, CardMedia } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { PromotionalCardsProps, EcommerceCategory } from "@/types/ecommerce";

export default function PromotionalCards({
  categories,
  onCategoryFilter,
}: PromotionalCardsProps) {
  // Get first 3 categories for promotional cards
  const promotionalCategories = categories.slice(0, 3);

  const getCardStyles = (index: number) => {
    const styles = [
      {
        bgcolor: "#f5e6d3", // Light beige/cream
        imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400",
        title: "Everyday Fresh & Clean with Our Products",
      },
      {
        bgcolor: "#ffe5e5", // Light pink
        imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
        title: "Make your Breakfast Healthy and Easy",
      },
      {
        bgcolor: "#e3f2fd", // Light blue-gray
        imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400",
        title: "The best Organic Products Online",
      },
    ];
    return styles[index] || styles[0];
  };

  if (promotionalCategories.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
        px: 2,
        py: 2,
        bgcolor: "white",
      }}
    >
      {promotionalCategories.map((category, index) => {
        const cardStyle = getCardStyles(index);
        return (
          <Card
            key={category.id}
            sx={{
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: cardStyle.bgcolor,
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  color: "text.primary",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                }}
              >
                {cardStyle.title}
              </Typography>
              <Button
                variant="contained"
                onClick={() => onCategoryFilter(category.id)}
                endIcon={<ArrowForward sx={{ fontSize: 14, fontWeight: 300 }} />}
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: "#ff6b35",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "#e55a2b",
                  },
                  "& .MuiButton-endIcon": {
                    marginLeft: 0.5,
                  },
                }}
              >
                Shop Now
              </Button>
            </CardContent>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: { xs: "40%", sm: "45%", md: "50%" },
                height: { xs: "60%", sm: "65%", md: "70%" },
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                image={category.image_url || cardStyle.imageUrl}
                alt={category.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}

