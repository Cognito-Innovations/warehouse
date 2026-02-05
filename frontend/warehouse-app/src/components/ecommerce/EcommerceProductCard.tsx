"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  useTheme,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import useProductStore from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import ProductQuantityControl from "./ProductQuantityControl";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";
import { formatDiscountPercentage } from "@/lib/utils";
import { calculateDiscountedPrice, formatPrice } from "@/utils/priceUtils"; 
import { CartItem, EcommerceProductCardProps } from "@/types/ecommerce";
import { normalizeCart } from "@/lib/utils";

export default function EcommerceProductCard({
  product
}: EcommerceProductCardProps) {
  const router = useRouter();
  const theme = useTheme();
  const {handleProductSelect} = useProductStore();
  const {addProductToCart, removeProductFromCart, cart} = useCartStore();

  const safeCart = normalizeCart(cart);
  const cartQuantity = safeCart.find((item: CartItem) => item.product_id === product.id)?.quantity || 0;


  const rawPrice = product.price.price;
  const currency = product.price.currency;
  const discountPercent = parseFloat(String(product.discount_percentage || 0)) || 0;
  const discountedRaw = calculateDiscountedPrice(rawPrice, discountPercent);
  const formattedDiscounted = formatPrice(discountedRaw, currency);
  const formattedOriginal = formatPrice(rawPrice, currency);

  const unitValue = parseFloat(String(product.unit_value || "0"));
  const measurementLabel = product.measurement?.label || "";
  const stockQuantity = product.stock_quantity;
  const isOutOfStock = stockQuantity === 0;

  const imageUrl = product.image_url || `https://placehold.co/300x180?text=${product.name}`;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addProductToCart(product.id, 1, product.stock_quantity);
  };

  const handleDecreaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeProductFromCart(product.id);
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
          height: { xs: 160, sm: 180 },
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
              top: { xs: 6, sm: 8 },
              left: { xs: 6, sm: 8 },
              bgcolor: ecommerceData.ui.colors.discountBadge,
              color: "white",
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              height: { xs: 18, sm: 20 },
              fontWeight: 600,
            }}
          />
        )}
        {isOutOfStock && (
          <Chip
            label="Out of Stock"
            size="small"
            sx={{
              position: "absolute",
              top: { xs: 6, sm: 8 },
              right: { xs: 6, sm: 8 },
              bgcolor: "red",
              color: "white",
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              height: { xs: 18, sm: 20 },
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ p: { xs: 1, sm: 1.25 }, pb: { xs: 0.75, sm: 1 }, pt: { xs: 1.5, sm: 1.25 }, "&:last-child": { pb: { xs: 0.75, sm: 1 } } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 0.5, sm: 0.5 },
            minHeight: { xs: 20, sm: "auto" },
          }}
        >
          {unitValue > 0 && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
            >
              Qty: {unitValue} {measurementLabel}
            </Typography>
          )}
        </Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            mb: { xs: 0.5, sm: 0.25 },

            // display: "-webkit-box",
            // WebkitLineClamp: { xs: 1, sm: 2 },
            // WebkitBoxOrient: "vertical",
            // overflow: "hidden",
            // fontSize: { xs: "0.8rem", sm: "0.9rem" },
            // mb: { xs: 0.5, sm: 0.25 },
            // lineHeight: { xs: 1.2, sm: 1.4 },
            // minHeight: { xs: 19.2, sm: "auto" },
          }}
        >
          {product.name || ""}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: { xs: "none", sm: "-webkit-box" },
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: { xs: 0, sm: 1 },
          }}
        >
          {product.description || ""}
        </Typography>

        {/* Price and Quantity Controls */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mt: { xs: 0.5, sm: 0 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              fontWeight={700}
              color="primary"
              sx={{ 
                fontSize: { xs: "0.9rem", sm: "1rem" }, 
                lineHeight: 1.2,
              }}
            >
              {discountPercent > 0 ? formattedDiscounted : formattedOriginal}
            </Typography>
            
            {discountPercent > 0 && (
              <Typography
                variant="caption"
                sx={{
                  textDecoration: "line-through",
                  color: "text.secondary",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              >
                {formattedOriginal}
              </Typography>
            )}
          </Box>
          

          {/* Add to Cart Button - Positioned opposite to price */}
          {!isOutOfStock && cartQuantity === 0 && (
            <Button
              onClick={handleAddClick}
              variant="outlined"
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                minWidth: { xs: 32, sm: 80 },
                width: { xs: 32, sm: "auto" },
                height: { xs: 32, sm: 36 },
                px: { xs: 0, sm: 1.5 },
                borderRadius: 1,
                borderWidth: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.875rem" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "primary.light",
                  color: "white",
                  borderWidth: 1.5,
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <Add sx={{ fontSize: { xs: 18, sm: 18 } }} />
              <Typography
                component="span"
                sx={{
                  display: { xs: "none", sm: "inline" },
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  ml: 0.5,
                }}
              >
                Add
              </Typography>
            </Button>
          )}

          {/* Quantity Controls - Only show when item is in cart */}
          {!isOutOfStock && cartQuantity > 0 && (
            <ProductQuantityControl
              quantity={cartQuantity}
              stockQuantity={stockQuantity}
              onIncrement={handleAddClick}
              onDecrement={handleDecreaseClick}
            />
          )}
          
        </Box>
        
        
      </CardContent>
    </Card>
  );
}