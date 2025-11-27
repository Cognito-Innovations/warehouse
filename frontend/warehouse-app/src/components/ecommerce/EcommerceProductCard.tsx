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
} from "@mui/material";
import { Star, Image as ImageIcon, Add, Remove } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import useProductStore from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
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
  const cartQuantity = useCartStore((state) => state.cartProducts.find(item => item.product_id === product.id)?.quantity || 0);

  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const selectedCountry = locationData.location.countryName;

  const rawPrice = product.price.price;
  const currency = product.price.currency;
  const formattedOriginal = formatPrice(rawPrice, currency);
  
  const discountPercent = parseFloat(String(product.discount_percentage || 0)) || 0;
  const discountedRaw = calculateDiscountedPrice(rawPrice, discountPercent);
  const formattedDiscounted = formatPrice(discountedRaw, currency);

  const unitValue = parseFloat(String(product.unit_value || "0"));
  const measurementLabel = product.measurement?.label || "";
  const stockQuantity = product.stock_quantity;
  const isOutOfStock = stockQuantity === 0;

  // Placeholder image URL  Make we process the image in 300x180 only for best UI view
  const placeholderImage = `https://placehold.co/300x180?text=${product.name}`;
  const imageUrl = product.image_url || placeholderImage;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementCartQuantity(product, selectedCountry);
  };

  const handleDecreaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrementCartQuantity(product, selectedCountry);
  };

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
      onClick={() => {
        handleProductSelect(product.id);
        router.push(`${ROUTES.PRODUCT}/${product.id}`);
      }}
    >
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
        {isOutOfStock && (
          <Chip
            label="Out of Stock"
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

      <CardContent sx={{ p: 2, pb: 1 }}>
        <Box sx={{display: "flex", alignItems: "flex-start", gap: 0.5, justifyContent: "space-between"}}>
          {unitValue > 0 && (
            <Chip label={`${unitValue} ${measurementLabel}`} variant="outlined" size="small" sx={{ mb: 1, borderColor: "primary.main", color: "primary.main", fontSize: "0.7rem", height: 20 }}/>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Star sx={{ fontSize: 16, color: ecommerceData.ui.colors.starColor }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
              4.1 32
            </Typography>
          </Box>
        </Box>
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

        {/* Price and Add Button */}
        <Box sx={{ 
          display: { xs: "block", sm: "flex" }, 
          alignItems: { sm: "center" }, 
          justifyContent: { sm: "space-between" }, 
          mb: 1 
        }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            mb: { xs: 1.5, sm: 0 }
          }}>
            <Typography variant="body1" fontWeight="bold" color="primary" sx={{ fontSize: "1rem" }}>
              {formattedDiscounted}
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
                {formattedOriginal}
              </Typography>
            )}
          </Box>

          {/* Add Button or Quantity Controls - NOW USES INTERNAL STATE */}
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
                    height: 32,
                    width: { xs: "100%", sm: "auto" },
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={handleDecreaseClick}
                    sx={{
                      width: 40,
                      height: 32,
                      p: 0,
                      position: "relative",
                    }}
                  >
                    <Remove sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 20, textAlign: "center" }}>
                    {cartQuantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleAddClick}
                    disabled={cartQuantity >= stockQuantity}
                    sx={{
                      width: 40,
                      height: 32,
                      p: 0,
                      position: "relative",
                      color: cartQuantity >= stockQuantity ? "action.disabled" : "inherit",
                    }}
                  >
                    <Add sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleAddClick}
                  sx={{
                    width: { xs: "100%", sm: 80 },
                    height: 32,
                    minWidth: { sm: 80 },
                    fontSize: "0.8rem",
                    position: "relative",
                  }}
                >
                  Add
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
                width: { xs: "100%", sm: 80 },
                height: 32,
                minWidth: { sm: 80 },
                fontSize: "0.8rem",
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