"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    IconButton,
    Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useCartStore } from "@/store/cartStore";
import { CartItem, EcommerceProduct } from "@/types/ecommerce";
import { formatPrice } from "@/utils/priceUtils";
import { ROUTES } from "@/utils/constants";

interface ProductCartActionsProps {
    product: EcommerceProduct;
    discountPriceRaw: number;
    currency: string;
}

export default function ProductCartActions({
    product,
    discountPriceRaw,
    currency,
}: ProductCartActionsProps) {
    const router = useRouter();
    const { addProductToCart, removeProductFromCart, cart } = useCartStore();
    const cartQuantity = cart?.find((item: CartItem) => item.product_id === product.id)?.quantity || 0;
    const stockQuantity = product.stock_quantity;
    const isOutOfStock = stockQuantity === 0;
    const formattedSubtotal = formatPrice(cartQuantity * discountPriceRaw, currency);

    const handleGoToCart = useCallback(() => {
        router.push(ROUTES.CART);
    }, [router]);

    const handleAddToCartClick = useCallback(() => {
        addProductToCart(product.id, 1, product.stock_quantity);
    }, [product]);

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
                            onClick={() => removeProductFromCart(product.id)}
                            disabled={cartQuantity <= 0}
                            sx={{
                                border: "1px solid",
                                borderColor: (cartQuantity <= 0) ? "action.disabled" : "primary.main",
                                bgcolor: "action.hover",
                                color: (cartQuantity <= 0) ? "action.disabled" : "primary.main",
                                width: 40,
                                height: 40,
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
                            <Remove />
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
                            onClick={() => addProductToCart(product.id, 1, product.stock_quantity)}
                            disabled={isOutOfStock || cartQuantity >= stockQuantity}
                            sx={{
                                border: "1px solid",
                                borderColor: (isOutOfStock || cartQuantity >= stockQuantity) ? "action.disabled" : "primary.main",
                                bgcolor: "action.hover",
                                color: (isOutOfStock || cartQuantity >= stockQuantity) ? "action.disabled" : "primary.main",
                                width: 40,
                                height: 40,
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
                            <Add />
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
                    onClick={cartQuantity > 0 ? handleGoToCart : handleAddToCartClick}
                    disabled={isOutOfStock}
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
                    {isOutOfStock
                        ? "Out of Stock"
                        : cartQuantity > 0
                            ? "Go To Cart"
                            : "Add to Cart"}
                </Button>
            </Box>
        </React.Fragment>
    );
}