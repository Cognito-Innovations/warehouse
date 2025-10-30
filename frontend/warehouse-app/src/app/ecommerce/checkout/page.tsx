"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { 
  ArrowBack, 
  Payment, 
  LocalShipping, 
  Security, 
  CheckCircle, 
  Star, 
  Timer,
  CreditCard,
  AccountBalance,
  PhoneAndroid,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCart, useCartActions } from "../../../store/ecommerceStore";
import { useAuth } from "@/contexts/AuthContext";
import { ecommerceService } from "../../../services/ecommerce.service";
import { toast } from "sonner";
import { ROUTES } from "@/utils/constants";
import OrderSuccessPopup from "@/components/ecommerce/OrderSuccessPopup";

export default function CheckoutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const { clearCart, fetchCart } = useCartActions();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    shippingAddress: "",
    billingAddress: "",
    notes: "",
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!cart) return; 

    if (!isOrderSuccessModalOpen && cart.items.length === 0) {
      router.push(ROUTES.ECOMMERCE);
    }
  }, [cart, isOrderSuccessModalOpen, router]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!cart) return;

    if (authLoading) {
      return;
    }

    if (!user) {
      toast.info("Please sign in to place your order");
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent('/ecommerce/checkout')}`);
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const orderData = {
        shipping_address: formData.shippingAddress,
        billing_address: formData.billingAddress,
        notes: formData.notes,
      };

      await ecommerceService.createOrder(orderData);

      clearCart();
      setIsOrderSuccessModalOpen(true);
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order. Please try again.");
      toast.error("Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    setIsOrderSuccessModalOpen(false);
    router.push(ROUTES.ECOMMERCE);
  };

  if (cartLoading || authLoading) {
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

  if ((!cart || cart.items.length === 0) && !isOrderSuccessModalOpen) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Top App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          px: 2
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => router.back()}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" color="black">
              Checkout
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <OrderSuccessPopup
        open={isOrderSuccessModalOpen}
        onContinueShopping={handleContinueShopping}
      />

      <Container maxWidth="lg" sx={{ py: 2 }}>

        <Grid container spacing={3}>
          {/* Order Summary */}
          {cart && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {cart.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} × ₹{Number(item.unit_price).toFixed(0)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{Number(item.total_price).toFixed(0)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">₹{Number(cart.total_amount).toFixed(0)}</Typography>
                  </Box>
                  
                  {cart.discount_percentage > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="success.main">
                        Discount
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -₹{Number(cart.discount_percentage).toFixed(0)}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2" color="success.main">
                      FREE
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Total
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{Number(cart.final_amount).toFixed(0)}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Payment />}
                  onClick={handlePlaceOrder}
                  disabled={processing || !formData.shippingAddress || authLoading}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    py: 1.5,
                  }}
                >
                  {processing ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={20} color="inherit" />
                      Processing...
                    </Box>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </Paper>
            </Grid>
          )}

          {/* Checkout Form */}
          {!isOrderSuccessModalOpen && (
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Delivery Information
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Shipping Address"
                      multiline
                      rows={4}
                      value={formData.shippingAddress}
                      onChange={handleInputChange("shippingAddress")}
                      placeholder="Enter your complete shipping address"
                      required
                      helperText="This is where your order will be delivered"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Billing Address (Optional)"
                      multiline
                      rows={4}
                      value={formData.billingAddress}
                      onChange={handleInputChange("billingAddress")}
                      placeholder="Enter your billing address (if different from shipping)"
                      helperText="Leave empty if same as shipping address"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Special Instructions (Optional)"
                      multiline
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange("notes")}
                      placeholder="Any special delivery instructions or notes"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Delivery Information:</strong><br />
                    • Orders are typically delivered within 1-2 business days<br />
                    • Free shipping on all orders<br />
                    • Fresh products are carefully packed and delivered<br />
                    • Contact us if you have any special requirements
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
