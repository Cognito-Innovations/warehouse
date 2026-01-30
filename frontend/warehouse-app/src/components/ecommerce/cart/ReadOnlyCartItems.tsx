"use client";

import React, { useState } from "react";
import { Paper, Box, Typography, Chip } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { formatPrice, getCartItemPricingSummary } from "@/utils/priceUtils";
import { getOptimalImageSizing, handleImageLoad, ImageDimensions } from "@/utils/imageUtils";
import { DEFAULT_CURRENCY_INFO } from "@/utils/constants";
import { CartItem } from "@/types/ecommerce";

interface ReadOnlyCartItemsProps {
  items: CartItem[];
  selectedCurrency?: string;
}

export default function ReadOnlyCartItems({
  items,
  selectedCurrency,
}: ReadOnlyCartItemsProps) {
  const { currencySymbol } = useDetectUserLocation();
  const currencyStr = currencySymbol || DEFAULT_CURRENCY_INFO.symbol;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        bgcolor: "white",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <CheckCircle sx={{ color: "success.main", mr: 1, fontSize: 20 }} />
        <Typography variant="h6" fontWeight="bold">
          Shopping Cart
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => {
          if (!item.product) return null;
          
          const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
          const pricing = getCartItemPricingSummary(item, currencySymbol);
          const unitPrice = pricing.discountedUnitPrice;
          const totalPrice = pricing.lineTotal;
          const unitValue = item.product.unit_value || 0;
          const measurementLabel = item.product.measurement?.label || "";
          const placeholderImage = `https://placehold.co/160x160?text=${item.product.name || "Product"}`;
          const imageUrl = item.product.image_url || placeholderImage;
          const stockStatus = item.product.stock_quantity > 0
            ? item.product.stock_quantity < 10
              ? `Only ${item.product.stock_quantity} left`
              : "In Stock"
            : "Out of Stock";

          const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            handleImageLoad(e, setImageDimensions);
          };

          const optimalSizing = getOptimalImageSizing(imageDimensions);

          return (
            <Box
              key={item.product_id || item.id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                bgcolor: "grey.50",
                border: "1px solid #e0e0e0",
              }}
            >
              {/* Product Image */}
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: "100%", sm: 100 },
                  height: { xs: 200, sm: 100 },
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={imageUrl}
                  alt={item.product.name}
                  onLoad={onImageLoad}
                  style={{
                    width: optimalSizing.width || "100%",
                    height: optimalSizing.height || "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Product Details */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      mb: 0.5,
                      flex: 1,
                      pr: 1,
                    }}
                  >
                    {item.product.name}
                  </Typography>
                </Box>

                {/* Stock Status */}
                {stockStatus !== "In Stock" && (
                  <Chip
                    label={stockStatus}
                    size="small"
                    sx={{
                      bgcolor: stockStatus.includes("Only") ? "warning.light" : "error.light",
                      color: stockStatus.includes("Only") ? "warning.dark" : "error.dark",
                      fontSize: "0.7rem",
                      height: 20,
                      mb: 1,
                    }}
                  />
                )}

                {/* Category */}
                {item.product.category && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                  >
                    Category: {item.product.category.name}
                  </Typography>
                )}

                {/* Weight */}
                {unitValue > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                  >
                    {unitValue} {measurementLabel}
                  </Typography>
                )}

                {/* Quantity and Price */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  >
                    Qty: {item.quantity}
                  </Typography>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.8rem" } }}
                    >
                      {formatPrice(unitPrice, currencyStr)}/unit
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="primary.main"
                      sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                    >
                      {item.quantity} × {formatPrice(unitPrice, currencyStr)} = {formatPrice(totalPrice, currencyStr)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
