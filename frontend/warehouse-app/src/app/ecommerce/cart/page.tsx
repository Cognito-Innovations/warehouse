"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Paper,
  useTheme,
  useMediaQuery,
  Badge,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ArrowBack,
  ShoppingCart,
  Add,
  Remove,
  Delete,
  LocalShipping,
  Security,
  Payment,
  LocationOn,
  Percent,
  CheckCircle,
  Star,
  Home,
  Store,
  Schedule,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCart, useCartActions } from "../../../store/ecommerceStore";

export default function CartPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { cart, itemCount, totalAmount } = useCart();
  const { updateCartItem, removeFromCart } = useCartActions();

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
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
              My Cart
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="50vh"
            textAlign="center"
          >
            <ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add some items to get started
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/ecommerce")}
              sx={{
                bgcolor: "#e91e63",
                textTransform: "none",
                px: 4,
                py: 1.5,
              }}
            >
              Start Shopping
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      setCouponCode("");
    }
  };

  const handleProceedToCheckout = () => {
    router.push("/ecommerce/checkout");
  };

  const getDiscountPrice = (item: any) => {
    return item.unit_price - (item.unit_price * item.product.discount_percentage) / 100;
  };

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
            My Cart
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {itemCount} items
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            },
            "& .Mui-selected": {
              color: "#1976d2",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          <Tab 
            label="Flipkart" 
            icon={<Store />}
            iconPosition="start"
          />
          <Tab 
            label="Grocery" 
            icon={<Home />}
            iconPosition="start"
          />
          <Tab 
            label={`Minutes (${itemCount})`} 
            icon={<Schedule />}
            iconPosition="start"
            sx={{ color: "#1976d2" }}
          />
        </Tabs>
      </Box>

      {/* Delivery Banner */}
      <Box
        sx={{
          bgcolor: "#d32f2f",
          color: "white",
          py: 1,
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          🚀 Quick delivery
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Cart Items */}
          <Box sx={{ flex: { md: "0 0 65%" }, width: { xs: "100%", md: "65%" } }}>
            {/* Delivery Address */}
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Deliver to: Ramu..., 600028
                </Typography>
                <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
                  HOME
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                kambar colony, anna nagar, chennai - 600028
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button size="small" sx={{ color: "#1976d2", textTransform: "none" }}>
                  Change
                </Button>
              </Box>
            </Paper>

            {/* Coupons Section */}
            {/*  <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        
              TODO: Uncomment this when we have coupons
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Save more with coupons
                </Typography>
                <Button size="small" color="primary" sx={{ textTransform: "none" }}>
                  View all
                </Button>
              </Box> 
              
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Avatar sx={{ bgcolor: "#e91e63" }}>
                  <Percent />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Flat ₹100 off
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Valid on orders above ₹349
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleApplyCoupon}
                  sx={{ textTransform: "none" }}
                >
                  Apply
                </Button>
              </Box>
            </Paper>
            */}

            {/* Cart Items */}
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Cart Items ({cart.items.length})
              </Typography>
              
              {cart.items.map((item) => {
                const discountPrice = getDiscountPrice(item);
                
                return (
                  <Card key={item.id} sx={{ mb: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "stretch" },
                        }}
                      >
                        {/* Product Image */}
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            image={item.product.image_url}
                            alt={item.product.name}
                            sx={{
                              borderRadius: 1,
                              objectFit: "contain",
                              width: { xs: 120, sm: 140, md: 160 },
                              height: { xs: 120, sm: 140, md: 160 },
                            }}
                          />
                          {item.product.discount_percentage > 0 && (
                            <Chip
                              label={`${item.product.discount_percentage}% off`}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -8,
                                left: -8,
                                bgcolor: "#4caf50",
                                color: "white",
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        </Box>

                        {/* Product Details */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {item.product.quantity} {item.product.measurement}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" gutterBottom>
                            {item.product.name}
                          </Typography>
                          
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              ₹{discountPrice.toFixed(0)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textDecoration: "line-through" }}
                            >
                              ₹{item.unit_price.toFixed(0)}
                            </Typography>
                            <Chip
                              label={`${item.product.discount_percentage}% off`}
                              size="small"
                              sx={{
                                bgcolor: "#4caf50",
                                color: "white",
                                fontSize: "0.7rem",
                              }}
                            />
                          </Box>

                          <Typography variant="caption" color="text.secondary">
                            Or Pay ₹{Math.round(discountPrice / 2)} + ⚡ {Math.round(discountPrice / 2)}
                          </Typography>
                        </Box>

                        {/* Quantity Controls */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "row", sm: "column" },
                            alignItems: "center",
                            justifyContent: { xs: "space-between", sm: "flex-start" },
                            gap: 1,
                            width: { xs: "100%", sm: "auto" },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              sx={{ bgcolor: "#1976d2", color: "white" }}
                            >
                              <Remove sx={{ fontSize: 16 }} />
                            </IconButton>
                            <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 24, textAlign: "center" }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              sx={{ bgcolor: "#1976d2", color: "white" }}
                            >
                              <Add sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                          
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ color: "error.main" }}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Paper>

            {/* Continue Shopping */}
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Continue Shopping
                </Typography>
                <IconButton onClick={() => router.push("/ecommerce")}>
                  <Typography variant="h6">→</Typography>
                </IconButton>
              </Box>
            </Paper>

            {/* Payment Offers */}
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Payment Offers
              </Typography>
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    SBI Debit Card
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    10% Instant Discount*
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Google Pay
                </Typography>
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                ₹30 Off on orders above ₹299
              </Typography>
            </Paper>

            {/* Free Delivery Threshold */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Add items worth ₹{Math.max(0, 299 - cart.final_amount)} more for FREE delivery
              </Typography>
            </Paper>
          </Box>

          {/* Order Summary */}
          <Box sx={{ flex: { md: "0 0 35%" }, width: { xs: "100%", md: "35%" } }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                position: { md: "sticky", xs: "static" },
                top: { md: 20, xs: 0 },
                minWidth: { md: 320, xs: "auto" },
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">₹{cart.total_amount.toFixed(0)}</Typography>
                </Box>
                
                {cart.discount_amount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="success.main">
                      Discount
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      -₹{cart.discount_amount.toFixed(0)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Delivery</Typography>
                  <Typography variant="body2" color="success.main">
                    FREE
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹{cart.final_amount.toFixed(0)}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleProceedToCheckout}
                sx={{
                  bgcolor: "linear-gradient(45deg, #ffeb3b 30%, #ff9800 90%)",
                  color: "black",
                  fontWeight: "bold",
                  py: 2,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  mb: 2,
                  "&:hover": {
                    bgcolor: "linear-gradient(45deg, #fdd835 30%, #f57c00 90%)",
                  },
                }}
              >
                Place Order
              </Button>

              <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                View price details
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}