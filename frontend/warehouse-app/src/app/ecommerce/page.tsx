"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Badge,
  AppBar,
  Toolbar,
  useTheme,
} from "@mui/material";
import {
  Search,
  ShoppingCart,
  Add,
  Remove,
  LocationOn,
  Star,
  LocalShipping,
  Security,
  Refresh,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { EcommerceProduct } from "../../types/ecommerce";
import { useProducts, useCart, useCartActions, useProductActions } from "../../store/ecommerceStore";
import { ROUTES } from "@/utils/constants";

export default function Ecommerce() {
  const theme = useTheme();
  const router = useRouter();
  
  // Use Zustand store
  const { 
    filteredProducts, 
    categories, 
    searchQuery, 
    selectedCategory, 
    loading, 
    error 
  } = useProducts();
  
  const { itemCount, cart } = useCart();
  const { addToCart, updateCartItem, removeFromCart, fetchCart } = useCartActions();
  const { setSearchQuery, setSelectedCategory, fetchCategories, fetchProducts, setLoading } = useProductActions();

  const initializeEcommerceData = useCallback(async () => {
    await Promise.all([
      fetchCategories().catch((err) => console.error("Categories fetch failed:", err)),
      fetchProducts().catch((err) => console.error("Products fetch failed:", err)),
      fetchCart().catch((err) => console.error("Cart fetch failed:", err)),
    ]);
  }, [fetchCategories, fetchProducts, fetchCart]);

  useEffect(() => {
    initializeEcommerceData().finally(() => {
      setLoading(false);
    });
  }, [initializeEcommerceData, setLoading]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleProductClick = (product: EcommerceProduct) => {
    router.push(`${ROUTES.PRODUCT}/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: EcommerceProduct) => {
    e.stopPropagation();
    const cartQuantity = getCartItemQuantity(product.id);
    if (cartQuantity + 1 > product.stock_quantity) {
      return;
    }
    addToCart(product.id, 1);
  };

  const handleDecreaseQuantity = (e: React.MouseEvent, product: EcommerceProduct) => {
    e.stopPropagation();
    const cartItem = cart?.items.find(item => item.product.id === product.id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateCartItem(cartItem.id, cartItem.quantity - 1);
      } else {
        removeFromCart(cartItem.id);
      }
    }
  };

  const getCartItemQuantity = (productId: string) => {
    const cartItem = cart?.items.find(item => item.product.id === productId);
    return cartItem?.quantity || 0;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography>Loading fresh products...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#ffff", minHeight: "100vh" }}>
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: "100%", xl: "1280px" },
          mx: "auto"
        }}
      >
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
          <Toolbar>
            <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }} color="primary">
              Palakart
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton color="inherit">
                <LocationOn />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                Deliver to: Bangalore, 560001
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Search Bar */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }} display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                bgcolor: "#f5f5f5",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>

        {/* Category Navigation */}
        <Box sx={{ bgcolor: "white", px: 2, py: 1, borderBottom: "1px solid #e0e0e0" }} >
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={2}>{"Today's"} Deals</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflowX: "auto",
                  alignItems: "center",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                <Chip
                  label="For You"
                  onClick={() => handleCategoryChange(null)}
                  variant={selectedCategory === null ? "filled" : "outlined"}
                  sx={{
                    bgcolor: selectedCategory === null ? "#7B1FA2" : "transparent",
                    color: selectedCategory === null ? "white" : "#7B1FA2",
                    borderColor: "#7B1FA2",
                    fontWeight: 600,
                    minWidth: 80,
                  }}
                />

                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => handleCategoryChange(category.id)}
                    variant={selectedCategory === category.id ? "filled" : "outlined"}
                    sx={{
                      bgcolor: selectedCategory === category.id ? "#7B1FA2" : "transparent",
                      color: selectedCategory === category.id ? "white" : "#7B1FA2",
                      borderColor: "#7B1FA2",
                      fontWeight: 600,
                      minWidth: 100,
                    }}
                  />
                ))}
              </Box>
              <IconButton
                color="inherit"
                onClick={() => router.push(ROUTES.CART)}
                sx={{ ml: 2 }}
              >
                <Badge badgeContent={itemCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Suggested for You Section */}
        <Box sx={{ bgcolor: "white", px: 2, py: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Suggested for You
            </Typography>
            {/* <Button
              variant="text"
              endIcon={<Refresh />}
              sx={{ color: "#e91e63", textTransform: "none" }}
            >
              Refresh
            </Button> */}
          </Box>

          {/* Products Grid */}
          <Grid container spacing={2}>
            {filteredProducts.map((product) => {
              const discountPrice = product.price - (product.price * product.discount_percentage) / 100;
              const cartQuantity = getCartItemQuantity(product.id);
              const unitValue = parseFloat(product.unit_value || '0');
              const measurementLabel = product.measurement?.label || '';
              const stockQuantity = product.stock_quantity;
              const isOutOfStock = stockQuantity === 0;

              return (
                <Grid key={product.id} xs={6} sm={4} md={3} lg={2.4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: theme.shadows[4],
                      },
                      borderRadius: 2,
                      overflow: "hidden",
                      opacity: isOutOfStock ? 0.6 : 1,
                    }}
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Product Image */}
                    <Box sx={{ position: "relative", height: 180, width: 250, overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        height={140}
                        width={250}
                        image={product.image_url}
                        alt={product.name}
                        sx={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%"
                        }}
                      />

                      {/* Discount Badge */}
                      {product.discount_percentage > 0 && (
                        <Chip
                          label={`${product.discount_percentage}% OFF`}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            bgcolor: "#4caf50",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
                    </Box>

                    {/* Product Info */}
                    <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
                      <Box>
                        {unitValue > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 1 }}
                          >
                            {unitValue} {measurementLabel}
                          </Typography>
                        )}

                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 0.5,
                          }}
                        >
                          {product.name}
                        </Typography>

                        {isOutOfStock && (
                          <Chip
                            label="Out of Stock"
                            color="error"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        )}

                        {/* Price and Add Button */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="primary"
                            >
                              ₹{discountPrice.toFixed(0)}
                            </Typography>
                            {product.discount_percentage > 0 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                              >
                                ₹{Number(product.price).toFixed(0)}
                              </Typography>
                            )}
                          </Box>

                          {/* Add to Cart Button */}
                          {isOutOfStock && cartQuantity === 0 ? (
                            <Chip label="Out of Stock" size="small" color="error" variant="outlined" />
                          ) : cartQuantity > 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                bgcolor: "white",
                                borderRadius: 2,
                                boxShadow: 1,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={(e) => handleDecreaseQuantity(e, product)}
                              >
                                <Remove sx={{ fontSize: 16 }} />
                              </IconButton>
                              <Typography variant="body2" fontWeight="bold" sx={{ px: 1 }}>
                                {cartQuantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={cartQuantity >= stockQuantity}
                              >
                                <Add sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                bgcolor: "#7B1FA2",
                                color: "white",
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                textTransform: "none",
                                boxShadow: 1,
                                "&:hover": {
                                  bgcolor: "#7B1FA2",
                                  boxShadow: 2
                                },
                              }}
                              onClick={(e) => handleAddToCart(e, product)}
                              startIcon={<Add sx={{ fontSize: 16 }} />}
                            >
                              Add
                            </Button>
                          )}
                        </Box>

                        {/* Rating */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Star sx={{ fontSize: 14, color: "#ffc107" }} />
                          <Typography variant="caption" color="text.secondary">
                            4.1 (32)
                          </Typography>
                        </Box>
                      </Box>

                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Empty State */}
          {filteredProducts.length === 0 && !loading && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="50vh"
              textAlign="center"
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms or browse different categories
              </Typography>
            </Box>
          )}
        </Box>

        {/* Bottom Navigation */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "white",
            borderTop: "1px solid #e0e0e0",
            p: 1,
            display: { xs: "flex", md: "none" },
            justifyContent: "space-around",
          }}
        >
          <Button
            variant="text"
            startIcon={<ShoppingCart />}
            onClick={() => router.push(ROUTES.CART)}
            sx={{ color: "#e91e63", textTransform: "none" }}
          >
            Cart ({itemCount})
          </Button>
          <Button
            variant="text"
            startIcon={<LocalShipping />}
            sx={{ color: "#666", textTransform: "none" }}
          >
            Orders
          </Button>
          <Button
            variant="text"
            startIcon={<Security />}
            sx={{ color: "#666", textTransform: "none" }}
          >
            Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
}