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
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import useProductStore from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import ProductQuantityControl from "./ProductQuantityControl";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";
import { formatDiscountPercentage } from "@/lib/utils";
import { calculateDiscountedPrice, formatPrice } from "@/utils/priceUtils";
import { EcommerceProductCardProps } from "@/types/ecommerce";

export default function EcommerceProductCard({
  product
}: EcommerceProductCardProps) {
  const router = useRouter();
  const theme = useTheme();
  const {handleProductSelect} = useProductStore();
  const incrementCartQuantity = useCartStore((state) => state.incrementCartQuantity);
  const decrementCartQuantity = useCartStore((state) => state.decrementCartQuantity);
  const cartQuantity = useCartStore((state) => state.cartProducts.find((item) => item.product_id === product.id))?.quantity || 0;

  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });

  const rawPrice = product.price.price;
  const currency = product.price.currency;
  const discountPercent = parseFloat(String(product.discount_percentage || 0)) || 0;
  const discountedRaw = calculateDiscountedPrice(rawPrice, discountPercent);
  const formattedOriginal = formatPrice(rawPrice, currency);
  const formattedDiscounted = formatPrice(discountedRaw, currency);

  const unitValue = parseFloat(String(product.unit_value || "0"));
  const measurementLabel = product.measurement?.label || "";
  const stockQuantity = product.stock_quantity;
  const isOutOfStock = stockQuantity === 0;

  const imageUrl = product.image_url || `https://placehold.co/300x180?text=${product.name}`;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementCartQuantity(product, locationData.currencyInfo.code);
  };

  const handleDecreaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrementCartQuantity(product, locationData.currencyInfo.code);
  };

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: ecommerceData.ui.spacing.cardBorderRadius,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease",
        opacity: isOutOfStock ? 0.6 : 1,
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => {
        handleProductSelect(product.id);
        router.push(`${ROUTES.PRODUCT}/${product.slug}`);
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: { xs: 140, sm: 180 },
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.name}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {discountPercent > 0 && !isOutOfStock && (
          <Chip
            label={formatDiscountPercentage(discountPercent, "OFF")}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: ecommerceData.ui.colors.discountBadge,
              color: "white",
              fontSize: "0.7rem",
              height: 20,
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ p: 1.25, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          {unitValue > 0 && (
            <Typography variant="caption" color="text.secondary">
              {unitValue} {measurementLabel}
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Star sx={{ fontSize: 14, color: ecommerceData.ui.colors.starColor }} />
            <Typography variant="caption" color="text.secondary">
              4.1
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "0.9rem",
            mb: 0.25,
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 1,
          }}
        >
          {product.description || ""}
        </Typography>

        {/* Price and Add Button  */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            justifyContent: { sm: "space-between" },
            gap: { xs: 0.75, sm: 1 },
          }}
        >
          <Box>
            <Typography
              variant="body1"
              fontWeight={700}
              color="primary"
              sx={{ fontSize: "1rem", lineHeight: 1 }}
            >
              {formattedDiscounted}
            </Typography>
            {discountPercent > 0 && (
              <Typography
                variant="caption"
                sx={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                }}
              >
                {formattedOriginal}
              </Typography>
            )}
          </Box>

          {/* Add Button or Quantity Controls */}
          {!isOutOfStock ? (
            cartQuantity > 0 ? (
              <ProductQuantityControl
                quantity={cartQuantity}
                stockQuantity={stockQuantity}
                onIncrement={handleAddClick}
                onDecrement={handleDecreaseClick}
              />
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleAddClick}
                sx={{
                  height: 32,
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { sm: 72 },
                  fontSize: "0.8rem",
                }}
              >
                Add
              </Button>
            )
          ) : (
            <Button
              variant="contained"
              disabled
              size="small"
              fullWidth
              sx={{
                height: 32,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Add
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}