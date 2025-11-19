"use client";

import React from "react";
import { ecommerceData } from "@/data/ecommerceData";
import { Box, Paper, CardMedia, Typography } from "@mui/material";
import { ProductDetailImageSectionProps } from "@/types/ecommerce";

export default function ProductDetailImageSection({
  product,
  previewProducts,
  onProductSelect,

}: ProductDetailImageSectionProps) {
  return (
    <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 50%" } }}>
      <Paper sx={{ p: 2, borderRadius: ecommerceData.ui.spacing.searchBorderRadius }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 4",
            borderRadius: ecommerceData.ui.spacing.cardBorderRadius,
            overflow: "hidden",
            bgcolor: "grey.100",
          }}>
          <CardMedia
            component="img"
            image={product.image_url || "https://placehold.co/100x100?text=No+Image"}
            alt={product.name}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=No+Image")}
          />
        </Box>

        {/* Preview Products */}
        <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "flex-start" }}>
          {previewProducts.map((previewProduct) => (
            <Box
              key={previewProduct.id}
              sx={{
                width: 80,
                height: 100, 
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                border:
                  product.id === previewProduct.id
                    ? `2px solid ${ecommerceData.ui.colors.quantityButtonBorder}`
                    : "2px solid transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                p: 0.5,
                bgcolor:
                  product.id === previewProduct.id
                    ? ecommerceData.ui.colors.searchBackground
                    : "transparent",
              }}
              onClick={() => onProductSelect(previewProduct)}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 50,
                  borderRadius: 1,
                  mb: 0.5,
                  overflow: "hidden",
                  bgcolor: "grey.100",
                }}
              >
                {previewProduct.image_url && (
                  <CardMedia
                    component="img"
                    image={previewProduct.image_url || "https://placehold.co/100x100?text=No+Image"}
                    alt={previewProduct.name}
                    sx={{ 
                      objectFit: "cover", 
                      width: "100%", 
                      height: "100%" 
                    }}
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=No+Image")}
                  />
                )}
              </Box>
              
              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  lineHeight: 1.2,
                  maxWidth: "100%",
                  fontWeight: product.id === previewProduct.id ? "bold" : "normal",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: 28,
                }}
              >
                {previewProduct.name}
              </Typography>
            </Box>
          ))}
        </Box>

      </Paper>
    </Box>
  );
}

