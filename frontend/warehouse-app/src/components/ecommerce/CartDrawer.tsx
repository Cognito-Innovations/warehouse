"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  useTheme,
  useMediaQuery,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  Add,
  Remove,
  Delete,
  ShoppingCart,
} from "@mui/icons-material";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

//TODO P0: Rework the cart drawer to use the new cart store
export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const {
    cart,
    loading,
    error,
    // updateCartItem,
    removeFromCart,
    clearCart,
  } = useCartStore();

  const handleCheckout = () => {
    onClose();
    router.push(ROUTES.CHECKOUT);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : 400,
          maxWidth: "100vw",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center">
            <ShoppingCart sx={{ mr: 1 }} />
            Cart ({cart?.items.length || 0})
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Cart Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={4}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : !cart || cart.items.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={8}
              px={2}
            >
              <ShoppingCart sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Add some fresh products to get started
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {cart.items.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ px: 2, py: 1.5 }}>
                    <Avatar
                      src={item.product.image_url}
                      alt={item.product.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.product.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            ₹{item.unit_price.toFixed(0)} each
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            Total: ₹{item.total_price.toFixed(0)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {/* Quantity Controls */}
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
                            size="small"
                            // onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="body2"
                            sx={{
                              px: 1,
                              minWidth: 32,
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            // onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Remove Button */}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            {/* Total */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ₹{cart.final_amount.toFixed(0)}
              </Typography>
            </Box>

            {/* Discount */}
            {cart.discount_percentage > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Discount
                </Typography>
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  -₹{cart.discount_percentage.toFixed(0)}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleClearCart}
                sx={{ textTransform: "none" }}
              >
                Clear Cart
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                sx={{ textTransform: "none", fontWeight: "bold" }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
