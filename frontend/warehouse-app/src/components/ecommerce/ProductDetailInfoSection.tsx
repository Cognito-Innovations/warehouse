"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Stack,
  Collapse,
} from "@mui/material";
import {
  Add,
  Remove,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { ProductDetailInfoSectionProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";
import { formatDiscountPercentage } from "@/lib/utils";

export default function ProductDetailInfoSection({
  product,
  cartQuantity,
  isCartActionLoading,
  isIncrementLoading = false,
  isDecrementLoading = false,
  isOutOfStock,
  discountPrice,
  originalPrice,
  discountPercentage,
  unitValue,
  measurementLabel,
  onAddToCart,
  onGoToCart,
  onIncrement,
  onDecrement,
  defaultRating,
  defaultReviewCount,
  selectedQuantityLabel,
  addToCartLabel,
  goToCartLabel,
  addingLabel,
  outOfStockLabel,
  quantityButtonBorderColor,
  offerTitle,
  offerBuyAt,
  applyOffersText,
  offerBackgroundColor,
}: ProductDetailInfoSectionProps) {
  const [offersExpanded, setOffersExpanded] = React.useState(false);

  const pricePerUnit = unitValue > 0 ? discountPrice : "0.00";
  const savingsAmount = originalPrice - discountPrice;
  const stockQuantity = product.stock_quantity || 0;
  const stockStatus = isOutOfStock ? "Out of Stock" : stockQuantity < 10 ? `Only ${stockQuantity} left!` : "In Stock";

  return (
    <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 50%" } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 4,
          height: "fit-content",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Top Section - Category (left) and Stock/Discount (right) */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          {/* Category - Top Left */}
          {product.category && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 400,
              }}
            >
              {product.category.name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')}
            </Typography>
          )}

          {/* Stock Status and Discount - Top Right */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              variant="body2"
              color="green"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 400
              }}
            >
              {stockStatus}
            </Typography>
          </Stack>
        </Box>

        {/* Product Name */}
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{
            mb: 1.5,
            fontSize: { xs: "1.5rem", md: "2rem" },
            lineHeight: 1.2,
            color: "text.primary"
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              const filled = starValue <= Math.floor(defaultRating);

              return filled ? (
                <Star
                  key={i}
                  sx={{
                    fontSize: 18,
                    color: ecommerceData.ui.colors.starColor,
                  }}
                />
              ) : (
                <StarBorder
                  key={i}
                  sx={{
                    fontSize: 18,
                    color: ecommerceData.ui.colors.starColor,
                  }}
                />
              );
            })}
          </Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {defaultRating}
          </Typography>
          <Typography variant="body2" color="text.primary" fontWeight={400}>
            ({defaultReviewCount} Reviews)
          </Typography>
        </Box>

        {/* Price Section */}
        <Box sx={{ mb: 3 }}>
          {discountPercentage > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              {formatDiscountPercentage(discountPercentage, "OFF")}
            </Typography>
          )}
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: "primary.main",
              fontSize: { xs: "1.75rem", md: "2rem" },
              lineHeight: 1,
              mb: 1,
            }}
          >
            ₹{discountPrice.toFixed(2)}
          </Typography>
          {discountPercentage > 0 && (
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  textDecoration: "line-through",
                  fontSize: "1rem",
                  fontWeight: 400,
                }}
              >
                ₹{originalPrice.toFixed(2)}
              </Typography>
              {savingsAmount > 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 400,
                  }}
                >
                  Save ₹{savingsAmount.toFixed(2)}
                </Typography>
              )}
            </Stack>
          )}
        </Box>

        {/* Product Description */}
        {product.description && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.2,
                fontSize: "0.98rem",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Description
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                fontSize: "0.92rem",
                fontWeight: 400,
              }}
            >
              {product.description}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Selected Quantity */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            gutterBottom
            sx={{ mb: 1.5 }}
          >
            {selectedQuantityLabel}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Button
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                borderWidth: 1,
                borderColor: quantityButtonBorderColor,
                color: quantityButtonBorderColor,
                fontWeight: 500,
                fontSize: "0.9rem",
                textTransform: "none",
                bgcolor: "transparent",
                "&:hover": {
                  borderWidth: 1,
                  borderColor: quantityButtonBorderColor,
                  bgcolor: "transparent",
                },
              }}
            >
              {unitValue} {measurementLabel}
            </Button>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: 400 }}
            >
              (₹{pricePerUnit}/kg)
            </Typography>
          </Stack>
        </Box>

        {/* Quantity Controls - Show above Add to Cart when item is in cart */}
        {cartQuantity > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <IconButton
                onClick={onDecrement}
                disabled={cartQuantity <= 0 || isDecrementLoading}
                sx={{
                  border: "1px solid",
                  borderColor: cartQuantity <= 0 || isDecrementLoading ? "action.disabled" : "primary.main",
                  bgcolor: "action.hover",
                  color: cartQuantity <= 0 || isDecrementLoading ? "action.disabled" : "primary.main",
                  width: 40,
                  height: 40,
                  position: "relative",
                  "&:hover:not(:disabled)": {
                    bgcolor: "action.hover",
                    borderColor: "primary.main",
                  },
                  "&:disabled": {
                    borderColor: "action.disabled",
                    color: "action.disabled",
                    bgcolor: "action.hover",
                    cursor: "not-allowed",
                  },
                }}
              >
                {isDecrementLoading ? (
                  <CircularProgress 
                    size={20} 
                    sx={{ 
                      color: "primary.main",
                      position: "absolute",
                    }} 
                  />
                ) : (
                  <Remove />
                )}
              </IconButton>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  minWidth: 40,
                  textAlign: "center",
                  color: "text.primary"
                }}
              >
                {cartQuantity}
              </Typography>
              <IconButton
                onClick={onIncrement}
                disabled={isOutOfStock || cartQuantity >= stockQuantity || isIncrementLoading}
                sx={{
                  border: "1px solid",
                  borderColor: "action.disabled",
                  bgcolor: "action.hover",
                  color: cartQuantity >= stockQuantity || isIncrementLoading ? "action.disabled" : "primary.main",
                  width: 40,
                  height: 40,
                  position: "relative",
                  "&:hover:not(:disabled)": {
                    bgcolor: "action.hover",
                    borderColor: "action.disabled",
                  },
                  "&:disabled": {
                    borderColor: "action.disabled",
                    color: "action.disabled",
                    bgcolor: "action.hover",
                    cursor: "not-allowed",
                  },
                }}
              >
                {isIncrementLoading ? (
                  <CircularProgress 
                    size={20} 
                    sx={{ 
                      color: "primary.main",
                      position: "absolute",
                    }} 
                  />
                ) : (
                  <Add />
                )}
              </IconButton>
              <Box sx={{ ml: "auto", textAlign: "right" }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                  Subtotal
                </Typography>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  ₹{(cartQuantity * discountPrice).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Offers Section */}
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOffersExpanded(!offersExpanded)}
            endIcon={offersExpanded ? <ExpandLess /> : <ExpandMore />}
            sx={{
              justifyContent: "space-between",
              textTransform: "none",
              py: 1.5,
              borderRadius: 2,
              borderColor: "divider",
              color: "text.primary",
              fontWeight: 500,
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              {applyOffersText}
            </Typography>
          </Button>
          <Collapse in={offersExpanded}>
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: offerBackgroundColor || "action.hover",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{
                      color: "error.main",
                      fontSize: "0.875rem",
                      mb: 0.5,
                    }}
                  >
                    {offerTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {offerBuyAt}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2,
                    py: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Apply
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Add to Cart / Go to Cart Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={cartQuantity > 0 ? onGoToCart : onAddToCart}
            disabled={isOutOfStock || isCartActionLoading || isIncrementLoading || isDecrementLoading}
            startIcon={
              isCartActionLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
          >
            {isCartActionLoading
              ? addingLabel
              : isOutOfStock
                ? outOfStockLabel
                : cartQuantity > 0
                  ? goToCartLabel
                  : addToCartLabel}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}