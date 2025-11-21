"use client";

import React from "react";
import { Box, Paper, Typography, Button, Divider, Stack, Collapse } from "@mui/material";
import { Star, StarBorder, ExpandMore, ExpandLess } from "@mui/icons-material";

import ProductCartActions from "./ProductCartActions";
import ProductDetailTabs from "./ProductDetailTabs"; 
import OfferCard from "./OfferCard";
import { formatDiscountPercentage } from "@/lib/utils";
import { calculateDiscountedPrice, formatPrice, parsePrice } from "@/utils/priceUtils";
import { ecommerceData } from "@/data/ecommerceData";
import { EcommerceProduct } from "@/types/ecommerce";

interface ProductDetailInfoSectionProps {
  product: EcommerceProduct;
}

export default function ProductDetailInfoSection({
  product,
}: ProductDetailInfoSectionProps) {
  const [offersExpanded, setOffersExpanded] = React.useState(false);

  const parsedOriginal = parsePrice(product.price);
  const currency = parsedOriginal.currency;
  const rawPrice = parsedOriginal.raw;
  const discountPercentage = parseFloat(String(product.discount_percentage || "0"));
  const discountPriceRaw = calculateDiscountedPrice(rawPrice, discountPercentage);
  const formattedDiscountPrice = formatPrice(discountPriceRaw, currency);
  const formattedOriginalPrice = parsedOriginal.formatted;
  const savingsAmount = rawPrice - discountPriceRaw;
  const formattedSavings = savingsAmount > 0 ? formatPrice(savingsAmount, currency) : '';

  const unitValue = parseFloat(String(product.unit_value || "0"));
  const pricePerUnitRaw = unitValue > 0 ? discountPriceRaw / unitValue : discountPriceRaw;
  const formattedPricePerUnit = formatPrice(pricePerUnitRaw, currency);
  const measurementLabel = product.measurement?.label || "";
  const stockQuantity = product.stock_quantity;
  const isOutOfStock = stockQuantity === 0;

  const stockStatus = isOutOfStock ? "Out of Stock" : stockQuantity < 10 ? `Only ${stockQuantity} left!` : "In Stock";
  
  const offers = [
    {
      title: "WOW! DEAL",
      description: "Buy at ₹18"
    }
  ];

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
              const filled = starValue <= Math.floor(4.1);

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
            4.1
          </Typography>
          <Typography variant="body2" color="text.primary" fontWeight={400}>
            32 Reviews
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
            {formattedDiscountPrice}
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
                {formattedOriginalPrice}
              </Typography>
              {formattedSavings && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 400,
                  }}
                >
                  Save {formattedSavings}
                </Typography>
              )}
            </Stack>
          )}
        </Box>

        <ProductDetailTabs product={product} />
        
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
            Selected Quantity:
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Button
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                borderWidth: 1,
                borderColor: "#e91e63",
                color: "#e91e63",
                fontWeight: 500,
                fontSize: "0.9rem",
                textTransform: "none",
                bgcolor: "transparent",
                "&:hover": {
                  borderWidth: 1,
                  borderColor: "#e91e63",
                  bgcolor: "transparent",
                },
              }}
            >
              {product.unit_value} {measurementLabel}
            </Button>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: 400 }}
            >
              ({formattedPricePerUnit}/{measurementLabel})
            </Typography>
          </Stack>
        </Box>

        {/* Offers Section */}
        <Box sx={{ mb: 2 }}>
          {offers.length > 0 && (
            <OfferCard
              offer={offers[0]}
              backgroundColor="#ffebee"
            />
          )}

          {offers.length > 1 && (
            <>
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
                  Apply offers for maximum savings!
                </Typography>
              </Button>
              <Collapse in={offersExpanded}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {offers.map((offer, index) => (
                    <OfferCard
                      key={index}
                      offer={offer as { title: string, description: string }}
                      backgroundColor="#ffebee"
                    />
                  ))}
                </Stack>
              </Collapse>
            </>
          )}
        </Box>

        <ProductCartActions
          product={product}
          discountPriceRaw={discountPriceRaw}
          currency={currency}
        />
      </Paper>
    </Box>
  );
}