"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  useTheme,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Star, Image as ImageIcon, Add, Remove } from "@mui/icons-material";
import { EcommerceProductCardProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";
import { formatDiscountPercentage } from "@/lib/utils";

export default function EcommerceProductCard({
  product,
  cartQuantity,
  onProductClick,
  onAddToCart,
  onDecreaseQuantity,
  defaultRating,
  defaultReviewCount,
  outOfStockLabel,
  addButtonLabel,
  isAddLoading = false,
  isIncrementLoading = false,
  isDecrementLoading = false,
}: EcommerceProductCardProps) {
  const theme = useTheme();
  const discountPrice = product.price - (product.price * product.discount_percentage) / 100;
  const unitValue = parseFloat(String(product.unit_value || "0"));
  const measurementLabel = product.measurement?.label || "";
  const stockQuantity = product.stock_quantity;
  const isOutOfStock = stockQuantity === 0;

  // Placeholder image URL  Make we process the image in 300x180 only for best UI view
  const placeholderImage = `https://placehold.co/300x180?text=${product.name}`;
  const imageUrl = product.image_url || placeholderImage;

  return (
    <Card
      sx={{
        borderRadius: ecommerceData.ui.spacing.cardBorderRadius,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        opacity: isOutOfStock ? 0.6 : 1,
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => onProductClick(product)}
    >
      {/* Product Image - matches skeleton height of 180 */}
      <Box sx={{ position: "relative", height: 180, width: "100%", overflow: "hidden" }}>
        {!product.image_url ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "grey.200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon sx={{ fontSize: 48, color: "grey.400" }} />
          </Box>
        ) : (
          <CardMedia
            component="img"
            height={180}
            image={imageUrl}
            alt={product.name}
            sx={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
            onError={(e: any) => {
              // Fallback to placeholder if image fails to load
              e.target.src = placeholderImage;
            }}
          />
        )}

        {/* Discount Badge - only show if not out of stock */}
        {product.discount_percentage > 0 && !isOutOfStock && (
          <Chip
            label={formatDiscountPercentage(product.discount_percentage, "OFF")}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: ecommerceData.ui.colors.discountBadge,
              color: "white",
              fontWeight: "bold",
              fontSize: "0.7rem",
            }}
          />
        )}

        {/* Out of Stock Badge - top right, opposite of discount */}
        {isOutOfStock && (
          <Chip
            label={outOfStockLabel}
            size="small"
            color="error"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              fontWeight: "bold",
              fontSize: "0.7rem",
            }}
          />
        )}
      </Box>

      {/* Product Info - matches skeleton CardContent structure */}
      <CardContent sx={{ p: 2, pb: 1 }}>
          
        {/* Unit Value - Chip with purple outline and Rating */}
        <Box sx={{display: "flex", alignItems: "flex-start", gap: 0.5, justifyContent: "space-between"}}>
          {unitValue > 0 && (
            <Chip label={`${unitValue} ${measurementLabel}`} variant="outlined" size="small" sx={{ mb: 1, borderColor: "primary.main", color: "primary.main", fontSize: "0.7rem", height: 20 }}/>
          )}
          {/* Rating - increased size */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Star sx={{ fontSize: 16, color: ecommerceData.ui.colors.starColor }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
              {defaultRating} ({defaultReviewCount})
            </Typography>
          </Box>
        </Box>


        {/* Product Name - matches skeleton: width 100%, height 20, mb: 0.5 */}
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 0.5,
            height: 20,
            lineHeight: 1.25,
          }}
        >
          {product.name}
        </Typography>

        {/* Description - 2 lines with ellipsis */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
            width: "100%",
            minHeight: 32,
            lineHeight: 1.4,
          }}
        >
          {product.description || ""}
        </Typography>

        {/* Price and Add Button - matches skeleton: flex space-between, mb: 1 */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          {/* Price - Discounted price first, then original price with strikethrough */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" fontWeight="bold" color="primary" sx={{ fontSize: "1rem" }}>
              ₹{discountPrice}
            </Typography>
            {product.discount_percentage > 0 && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                }}
              >
                ₹{product.price}
              </Typography>
            )}
          </Box>

          {/* Add Button or Quantity Controls */}
          {!isOutOfStock && (
            <>
              {cartQuantity > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    border: `1px solid ${ecommerceData.ui.colors.borderColor}`,
                    borderRadius: 1,
                    height: 28,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDecreaseQuantity(e, product);
                    }}
                    disabled={isDecrementLoading}
                    sx={{
                      width: 28,
                      height: 28,
                      p: 0,
                      position: "relative",
                      color: isDecrementLoading ? "action.disabled" : "inherit",
                    }}
                  >
                    {isDecrementLoading ? (
                      <CircularProgress size={16} sx={{ color: "primary.main" }} />
                    ) : (
                      <Remove sx={{ fontSize: 16 }} />
                    )}
                  </IconButton>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 20, textAlign: "center" }}>
                    {cartQuantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cartQuantity < stockQuantity) {
                        onAddToCart(e, product);
                      }
                    }}
                    disabled={cartQuantity >= stockQuantity || isIncrementLoading}
                    sx={{
                      width: 28,
                      height: 28,
                      p: 0,
                      position: "relative",
                      color: isIncrementLoading ? "action.disabled" : "inherit",
                    }}
                  >
                    {isIncrementLoading ? (
                      <CircularProgress size={16} sx={{ color: "primary.main" }} />
                    ) : (
                      <Add sx={{ fontSize: 16 }} />
                    )}
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(e, product);
                  }}
                  disabled={isAddLoading}
                  sx={{
                    width: 80,
                    height: 32,
                    minWidth: 80,
                    fontSize: "0.8rem",
                    position: "relative",
                  }}
                >
                  {isAddLoading ? (
                    <CircularProgress size={16} sx={{ color: "white" }} />
                  ) : (
                    addButtonLabel
                  )}
                </Button>
              )}
            </>
          )}
          {isOutOfStock && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled
              sx={{
                width: 80,
                height: 32,
                minWidth: 80,
                fontSize: "0.8rem",
              }}
            >
              {addButtonLabel}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

