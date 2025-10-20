"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { EcommerceProduct } from "../../types/ecommerce";
import { useCart, useCartActions } from "../../store/ecommerceStore";

interface ProductCardProps {
  product: EcommerceProduct;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Safely use cart context
  let addToCart, cart;
  try {
    const cartContext = useCart();
    addToCart = cartContext.addToCart;
    cart = cartContext.cart;
  } catch (error) {
    // Cart context not available, use fallback
    addToCart = () => {};
    cart = null;
  }

  const discountPrice = product.price - (product.price * product.discount_percentage) / 100;
  const cartItem = cart?.items.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This would need to be implemented in the cart context
    // For now, we'll just add/remove one at a time
    if (quantity > 1) {
      // Update quantity logic would go here
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
      onClick={onClick}
    >
      {/* Product Image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={isMobile ? 200 : 240}
          image={product.image_url}
          alt={product.name}
          sx={{
            objectFit: "cover",
            bgcolor: "grey.100",
          }}
        />
        
        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <Chip
            label={`${product.discount_percentage}% OFF`}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              fontWeight: "bold",
            }}
          />
        )}

        {/* Add to Cart Button */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
          }}
        >
          {quantity > 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "primary.main",
                color: "white",
                borderRadius: 2,
                minWidth: 80,
                justifyContent: "space-between",
              }}
            >
              <IconButton
                size="small"
                onClick={handleRemoveFromCart}
                sx={{ color: "white" }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography variant="body2" fontWeight="bold">
                {quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={handleAddToCart}
                sx={{ color: "white" }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={handleAddToCart}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 2,
              }}
            >
              Add
            </Button>
          )}
        </Box>
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.5em",
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.5em",
          }}
        >
          {product.description || `${product.quantity} ${product.measurement || "units"}`}
        </Typography>

        {/* Price */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
          >
            ₹{discountPrice.toFixed(0)}
          </Typography>
          {product.discount_percentage > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >
              ₹{product.price.toFixed(0)}
            </Typography>
          )}
        </Box>

        {/* Quantity/Measurement */}
        <Typography variant="caption" color="text.secondary">
          {product.quantity} {product.measurement || "units"}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              borderColor: "primary.dark",
              bgcolor: "primary.50",
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
