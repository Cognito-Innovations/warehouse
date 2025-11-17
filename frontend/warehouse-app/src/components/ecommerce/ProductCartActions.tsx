"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    IconButton,
    CircularProgress,
    Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useCartActions } from "@/store/ecommerceStore";
import { ProductCartActionsProps } from "@/types/ecommerce";
import { formatPrice } from "@/utils/priceUtils";
import { ROUTES } from "@/utils/constants";

export default function ProductCartActions({
    product,
    cart,
    discountPriceRaw,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
}: ProductCartActionsProps) {
    const router = useRouter();
    const { fetchCart } = useCartActions();
    const [isCartActionLoading, setIsCartActionLoading] = useState(false);
    const [isIncrementLoading, setIsIncrementLoading] = useState(false);
    const [isDecrementLoading, setIsDecrementLoading] = useState(false);
    const [displayedQuantity, setDisplayedQuantity] = useState<number | null>(null);

    const getCartItemQuantity = useCallback((productId: string) => {
        const cartItem = cart?.items.find((item) => item.product.id === productId);
        return cartItem?.quantity || 0;
    }, [cart]);

    // Sync displayed quantity with cart when cart updates and not loading
    useEffect(() => {
      if (product && !isIncrementLoading && !isDecrementLoading && !isCartActionLoading) {
        const actualQuantity = getCartItemQuantity(product.id);
        setDisplayedQuantity(actualQuantity);
      }
    }, [cart, product, isIncrementLoading, isDecrementLoading, isCartActionLoading, getCartItemQuantity]);

    // Reset displayed quantity when product changes
    useEffect(() => {
        if (product) {
          const actualQuantity = getCartItemQuantity(product.id);
          setDisplayedQuantity(actualQuantity);
        }
    }, [product.id, getCartItemQuantity]);

    const handleAddToCart = useCallback(async () => {
        if (product) {
            const stockQuantity = product.stock_quantity;

            const currentCartQuantity = getCartItemQuantity(product.id);
            if (currentCartQuantity + 1 > stockQuantity) {
                return;
            }

            setIsCartActionLoading(true);
            try {
                await addToCart(product.id, 1);
                await fetchCart();
            } finally {
                setIsCartActionLoading(false);
            }
        }
    }, [product, getCartItemQuantity, addToCart, fetchCart]);

    const handleIncrement = useCallback(async () => {
        if (product) {
            const stockQuantity = product.stock_quantity;
            const currentCartQuantity = displayedQuantity !== null ? displayedQuantity : getCartItemQuantity(product.id);
            
            if (currentCartQuantity + 1 > stockQuantity || isIncrementLoading) {
              return;
            }

            setIsIncrementLoading(true);
            try {
              await addToCart(product.id, 1);
              await fetchCart();
              // After API succeeds, update displayed quantity optimistically
              setDisplayedQuantity(currentCartQuantity + 1);
            } catch (err) {
              console.error("Failed to add to cart:", err);
              // On error, sync back to actual cart quantity
              setDisplayedQuantity(getCartItemQuantity(product.id));
            } finally {
              setIsIncrementLoading(false);
            }
        }
    }, [product, getCartItemQuantity, addToCart, fetchCart, displayedQuantity, isIncrementLoading]);

    const handleDecrement = useCallback(async () => {
        if (!product || isDecrementLoading) return;

        const cartItem = cart?.items.find((item) => item.product.id === product.id);
        if (!cartItem) return;

        const currentCartQuantity = displayedQuantity !== null ? displayedQuantity : cartItem.quantity;
        const newQuantity = currentCartQuantity - 1;

        if (newQuantity < 0) return;
        setIsDecrementLoading(true);

        try {
            if (newQuantity === 0) {
                await removeFromCart(cartItem.id);
                await fetchCart();
                setDisplayedQuantity(0);
            } else {
                await updateCartItem(cartItem.id, newQuantity);
                await fetchCart();
                setDisplayedQuantity(newQuantity);
            }
        } catch (err) {
          console.error("Failed to update cart:", err);
          const actualQuantity = getCartItemQuantity(product.id);
          setDisplayedQuantity(actualQuantity);
        } finally {
          setIsDecrementLoading(false);
        }
    }, [product, cart, updateCartItem, removeFromCart, displayedQuantity, isDecrementLoading, getCartItemQuantity, fetchCart]);

    const handleGoToCart = useCallback(() => {
        router.push(ROUTES.CART);
    }, [router]);

    const actualCartQuantity = getCartItemQuantity(product.id);
    // Use displayedQuantity if available (during loading), otherwise use actual cart quantity
    const cartQuantity = displayedQuantity !== null ? displayedQuantity : actualCartQuantity;
    const stockQuantity = product.stock_quantity;
    const isOutOfStock = stockQuantity === 0;
    const formattedSubtotal = formatPrice(cartQuantity * discountPriceRaw, currency);

    return (
        <React.Fragment>
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
                            onClick={handleDecrement}
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
                            onClick={handleIncrement}
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
                            {formattedSubtotal}
                        </Typography>
                      </Box>
                    </Box>
                </Box>
            )}

        {/* Add to Cart / Go to Cart Button */}
        <Box sx={{ mb: 3 }}>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={cartQuantity > 0 ? handleGoToCart : handleAddToCart}
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
                    ? "Adding..."
                    : isOutOfStock
                        ? "Out of Stock"
                        : cartQuantity > 0
                            ? "Go To Cart"
                            : "Add to Cart"}
            </Button>
        </Box>
    </React.Fragment>
  );
}