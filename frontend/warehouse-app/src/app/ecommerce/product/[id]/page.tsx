"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  CardMedia,
  Paper,
  Badge,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  ArrowBack,
  ShoppingCart,
  Share,
  LocalShipping,
  Security,
  Star,
} from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { useProducts, useCart, useCartActions } from "../../../../store/ecommerceStore";
import { ROUTES } from "@/utils/constants";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { products } = useProducts();
  const { cart, itemCount } = useCart();
  const { addToCart, updateCartItem } = useCartActions();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get product from store
  const product = products.find(p => p.id === params.id);

  const productImages = [
    product?.image_url || "https://images.unsplash.com/photo-1537640538966-79f369143b8f?w=800",
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800",
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800",
  ];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  useEffect(() => {
    if (product) {
      setLoading(false);
    } else {
      setError("Product not found");
      setLoading(false);
    }
  }, [product]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Product not found"}</Alert>
      </Container>
    );
  }

  const getCartItemByProductId = (productId: string) => {
    return cart?.items.find(item => item.product.id === productId);
  };

  const getCartItemQuantity = (productId: string) => {
    const cartItem = getCartItemByProductId(productId);
    return cartItem?.quantity || 0;
  };

  const handleIncrement = () => {
    if (product) {
      addToCart(product.id, 1);
    }
  };

  const handleDecrement = () => {
    if (!product) return;
    const cartItem = getCartItemByProductId(product.id);
    if (!cartItem) return;
    updateCartItem(cartItem.id, cartItem.quantity - 1);
  };

  const discountPrice = product.price - (product.price * product.discount_percentage) / 100;
  // TODO: We need to implement get cart item quantity
  const cartQuantity = getCartItemQuantity(product.id);

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Top App Bar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.back()}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }} color="primary">
            Product Details
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            
            <IconButton color="inherit">
              <Share />
            </IconButton>
            
            <IconButton 
              color="inherit" 
              onClick={() => router.push(ROUTES.CART)}
            >
              <Badge badgeContent={itemCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
          {/* Product Images */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 50%" } }}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height={400}
                  image={productImages[selectedImage]}
                  alt={product.name}
                  sx={{
                    borderRadius: 2,
                    objectFit: "cover",
                    bgcolor: "grey.100",
                  }}
                />
                
                {/* Promotional Banner */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: "#d32f2f",
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    SWEET-SOUR, FOR JUICES
                  </Typography>
                  <IconButton size="small" sx={{ color: "white" }}>
                    <Share sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>

                {/* Rating Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    bgcolor: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    4.1
                  </Typography>
                  <Star sx={{ fontSize: 16, color: "#4caf50" }} />
                  <Typography variant="body2" color="text.secondary">
                    (32)
                  </Typography>
                </Box>

                {/* Expiry Date */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    bgcolor: "rgba(0,0,0,0.7)",
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="caption">
                    Expiry 22 Oct 2025
                  </Typography>
                </Box>
              </Box>

              {/* Image Thumbnails */}
              <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "center" }}>
                {productImages.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: selectedImage === index ? "2px solid #e91e63" : "2px solid transparent",
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      image={image}
                      alt={`${product.name} ${index + 1}`}
                      sx={{ objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 50%" } }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: "fit-content" }}>
              {/* Product Name */}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product.name} ({product.quantity} {product.measurement})
              </Typography>

              {/* Price and Discount */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Chip
                  label={`${product.discount_percentage}% OFF`}
                  sx={{
                    bgcolor: "#4caf50",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  ₹{discountPrice.toFixed(0)}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  ₹{Number(product.price).toFixed(0)}
                </Typography>
              </Box>

              {/* Selected Quantity */}
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Selected Quantity: {product.quantity} {product.measurement}
              </Typography>

              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderColor: "#e91e63",
                    color: "#e91e63",
                    fontWeight: "bold",
                  }}
                >
                  {product.quantity} {product.measurement}
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  (₹{Math.round(discountPrice / (product.quantity / 1000))}/kg)
                </Typography>
              </Box>

              {/* Special Offers */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: "#d32f2f",
                    color: "white",
                    p: 2,
                    borderRadius: 2,
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      WOW! DEAL
                    </Typography>
                    <Typography variant="body2">
                      Buy at ₹18
                    </Typography>
                  </Box>
                  <IconButton sx={{ color: "white" }}>
                    <Typography variant="h6">▼</Typography>
                  </IconButton>
                </Box>
                
                <Box
                  sx={{
                    bgcolor: "#ffebee",
                    color: "text.primary",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">
                    Apply offers for maximum savings!
                  </Typography>
                </Box>
              </Box>

              {/* Product Description */}
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {product.description}
              </Typography>
              
              {/* Delivery Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Delivery Information
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <LocalShipping sx={{ color: "#4caf50" }} />
                  <Typography variant="body2">Free delivery on orders above ₹299</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Security sx={{ color: "#4caf50" }} />
                  <Typography variant="body2">Secure packaging guaranteed</Typography>
                </Box>
              </Box>

              {/* Add to Cart Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                sx={{
                  bgcolor: "linear-gradient(45deg, #ffeb3b 30%, #ff9800 90%)",
                  color: "black",
                  fontWeight: "bold",
                  py: 2,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  textTransform: "none"
                }}
              >
                Add to Cart
                {cartQuantity > 0 && (
                  <Box sx={{ display: "inline-flex", alignItems: "center", ml: 2, bgcolor: "white", borderRadius: 2, overflow: "hidden", backgroundColor:"primary"}}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDecrement(); }} sx={{ px: 1, color: "black" }}>
                      -
                    </IconButton>
                    <Typography variant="body2" sx={{ px: 1.5, fontWeight: "bold", color: "black" }}>
                      {cartQuantity}
                    </Typography>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleIncrement(); }} sx={{ px: 1, color: "black" }}>
                      +
                    </IconButton>
                  </Box>
                )}
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}