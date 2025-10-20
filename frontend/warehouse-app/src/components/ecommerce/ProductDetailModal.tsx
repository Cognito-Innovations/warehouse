"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Divider,
  TextField,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import {
  Close,
  Add,
  Remove,
  Star,
  LocalShipping,
  Security,
  Refresh,
} from "@mui/icons-material";
import { EcommerceProduct } from "../../types/ecommerce";
import { useCart, useCartActions } from "../../store/ecommerceStore";

interface ProductDetailModalProps {
  product: EcommerceProduct;
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  open,
  onClose,
}: ProductDetailModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const discountPrice = product.price - (product.price * product.discount_percentage) / 100;
  const cartItem = cart?.items.find(item => item.product.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: isMobile ? "100vh" : "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Product Details
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
          {/* Product Image */}
          <Box
            sx={{
              width: isMobile ? "100%" : "50%",
              height: isMobile ? 300 : 400,
              position: "relative",
            }}
          >
            <Avatar
              src={product.image_url}
              alt={product.name}
              variant="rounded"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: isMobile ? 0 : 2,
              }}
            />
            
            {/* Discount Badge */}
            {product.discount_percentage > 0 && (
              <Chip
                label={`${product.discount_percentage}% OFF`}
                color="error"
                size="medium"
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  fontWeight: "bold",
                }}
              />
            )}
          </Box>

          {/* Product Info */}
          <Box
            sx={{
              width: isMobile ? "100%" : "50%",
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "text.primary" }}
            >
              {product.name}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              {product.description || "Fresh and high-quality product delivered to your doorstep."}
            </Typography>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Typography
                  variant="h3"
                  color="primary"
                  fontWeight="bold"
                >
                  ₹{discountPrice.toFixed(0)}
                </Typography>
                {product.discount_percentage > 0 && (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ₹{product.price.toFixed(0)}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product.quantity} {product.measurement || "units"} available
              </Typography>
            </Box>

            {/* Features */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Why Choose This Product?
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocalShipping color="primary" fontSize="small" />
                  <Typography variant="body2">
                    Fast 1-2 day delivery
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Security color="primary" fontSize="small" />
                  <Typography variant="body2">
                    Fresh from farm to your door
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Refresh color="primary" fontSize="small" />
                  <Typography variant="body2">
                    Easy returns and exchanges
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Quantity Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quantity
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      px: 2,
                      minWidth: 40,
                      textAlign: "center",
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    <Add />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Max 10 per order
                </Typography>
              </Box>
            </Box>

            {/* Cart Status */}
            {cartQuantity > 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {cartQuantity} item(s) already in cart
              </Alert>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none", minWidth: 120 }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleAddToCart}
          startIcon={<Add />}
          sx={{
            textTransform: "none",
            minWidth: 160,
            fontWeight: "bold",
          }}
        >
          Add to Cart ({quantity})
        </Button>
      </DialogActions>
    </Dialog>
  );
}
