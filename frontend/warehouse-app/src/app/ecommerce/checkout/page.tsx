"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
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
  Avatar,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import { 
  ArrowBack, 
  Payment, 
  LocalShipping, 
  Security, 
  CheckCircle, 
  Timer,
  Home,
  DeliveryDining,
  FormatListBulleted,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useCart, useCartActions } from "../../../store/ecommerceStore";
import { useAuth } from "@/contexts/AuthContext";
import { ecommerceService } from "../../../services/ecommerce.service";
import { toast } from "sonner";
import { ROUTES } from "@/utils/constants";
import OrderSuccessPopup from "@/components/ecommerce/OrderSuccessPopup";
import { formatDiscountPercentage } from "@/lib/utils";

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

  const DELIVERY_CHARGES = 50;
  const FREE_DELIVERY_THRESHOLD = 100;

  const calculateCartAmounts = () => {
    if (!cart) return { subtotal: 0, discount: 0, delivery: 0, total: 0 };

    const subtotal = Number(cart.total_amount) || 0;
    const discountPercentage = Number(cart.discount_percentage) || 0;
    
    const discountAmount = (subtotal * discountPercentage) / 100;
    
    const deliveryCharges = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGES;
    
    const total = subtotal - discountAmount + deliveryCharges;

    return {
      subtotal,
      discountAmount,
      deliveryCharges,
      total
    };
  };

  const { subtotal, discountAmount, deliveryCharges, total } = calculateCartAmounts();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!cart || authLoading) return;

    const shouldAutoOrder = localStorage.getItem("shouldPlaceOrderAfterLogin") === "true";

    if (!processing 
      && !isOrderSuccessModalOpen 
      && cart?.items?.length === 0 
      && !shouldAutoOrder
    ) {
      router.push(ROUTES.ECOMMERCE);
    }
  }, [cart, authLoading, processing, isOrderSuccessModalOpen, router]);

  useEffect(() => {
    if (
      user &&
      cart &&
      cart.items.length > 0 &&
      localStorage.getItem("shouldPlaceOrderAfterLogin") === "true"
    ) {
      const savedData = JSON.parse(localStorage.getItem("pendingOrder") || "{}");
    
      if (savedData.shippingAddress) {
        setFormData(savedData);
        handlePlaceOrder();
      }
    
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("shouldPlaceOrderAfterLogin");
    }
  }, [user, cart]);

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
      localStorage.setItem("pendingOrder", JSON.stringify(formData));
      localStorage.setItem("shouldPlaceOrderAfterLogin", "true");
  
      toast.info("Please sign in to place your order");
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent("/ecommerce/checkout")}`);
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

  if (authLoading) {
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
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* Top App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: "white",
          borderBottom: "1px solid #e9ecef",
          px: { xs: 1, sm: 2 },
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton 
              onClick={() => router.back()}
              sx={{ 
                color: "text.primary",
                "&:hover": { bgcolor: "grey.100" }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Checkout
              </Typography>
              <Chip 
                label={cart?.items?.length || 0} 
                size="small" 
                color="primary" 
                sx={{ 
                  height: 20, 
                  fontSize: "0.75rem",
                  fontWeight: 600 
                }} 
              />
            </Stack>
          </Box>
          <IconButton 
            href={ROUTES.ECOMMERCE}
            sx={{ 
              color: "primary.main",
              "&:hover": { bgcolor: "primary.50" }
            }}
          >
            <FormatListBulleted />
          </IconButton>
        </Toolbar>
      </AppBar>

      <OrderSuccessPopup
        open={isOrderSuccessModalOpen}
        onContinueShopping={handleContinueShopping}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 1, md: 3 }, px: { xs: 1, sm: 2 } }}>
        {/* Fast Delivery Card */}
        <Card 
          sx={{ 
            mb: 3, 
            borderRadius: 3, 
            overflow: "visible",
            position: "relative",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: 3,
            }
          }}
        >
          <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "white", color: "primary.main", width: 48, height: 48 }}>
                <LocalShipping />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Get it delivered in 1-2 hours*
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Grid container spacing={3}>
              {/* Delivery Address Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 3, 
                    border: "1px solid #e9ecef",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "box-shadow 0.2s ease",
                    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                    height: "100%"
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                      <Home sx={{ color: "primary.main", fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={600} color="text.primary">
                        Delivery Address
                      </Typography>
                    </Stack>

                    {error && (
                      <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    )}

                    <TextField
                      fullWidth
                      label="Enter your complete address"
                      multiline
                      rows={4}
                      value={formData.shippingAddress}
                      onChange={handleInputChange("shippingAddress")}
                      placeholder="House number, street, locality, city, pincode, etc."
                      required
                      variant="outlined"
                      sx={{ 
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "white",
                          "& fieldset": { borderColor: "#e9ecef" },
                          "&:hover fieldset": { borderColor: "primary.main" },
                          "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 },
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocalShipping sx={{ color: "grey.400", fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        maxLength: 500,
                      }}
                      helperText={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#666" }}>This is where your order will be delivered</span>
                          <Chip 
                            label={`${formData.shippingAddress.length}/500`} 
                            size="small" 
                            variant="outlined" 
                            color={formData.shippingAddress.length > 0 ? "success" : "default"}
                            sx={{ fontSize: "0.75rem"  }}
                          />
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Delivery Details Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 3, 
                    border: "1px solid #e9ecef",
                    bgcolor: "grey.50",
                    height: "100%"
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                      <Timer sx={{ color: "primary.main", fontSize: 28 }} />
                      <Typography variant="h6" fontWeight={600} color="text.primary">
                        Delivery Details
                      </Typography>
                    </Stack>

                    <List dense sx={{ p: 0, "& .MuiListItem-root": { py: 0.5 } }}>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32, color: "success.main" }}>
                          <DeliveryDining sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Lightning Fast Delivery" 
                          primaryTypographyProps={{ fontWeight: 500, color: "text.primary" }}
                          secondary="Typically within 1-2 hours in your city" 
                          secondaryTypographyProps={{ color: "text.secondary" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32, color: "success.main" }}>
                          <CheckCircle sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Fresh & Packed with Care" 
                          primaryTypographyProps={{ fontWeight: 500, color: "text.primary" }}
                          secondary="All products carefully selected and packaged" 
                          secondaryTypographyProps={{ color: "text.secondary" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 32, color: "warning.main" }}>
                          <Security sx={{ fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Secure Checkout" 
                          primaryTypographyProps={{ fontWeight: 500, color: "text.primary" }}
                          secondary="Your data is protected with top encryption" 
                          secondaryTypographyProps={{ color: "text.secondary" }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            {/* Order Summary Card */}
            <Card 
              variant="outlined" 
              sx={{ 
                mb: 3, 
                borderRadius: 3, 
                border: "1px solid #e9ecef",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                  <Payment sx={{ color: "primary.main", fontSize: 28 }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Order Summary
                  </Typography>
                </Stack>

                <Box sx={{ mb: 2, maxHeight: 300, overflow: "auto" }}>
                  {cart?.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        py: 1.5,
                        borderBottom: "1px solid #f0f0f0",
                        "&:last-child": { borderBottom: "none" }
                      }}
                    >
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5, color: "text.primary" }}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Qty: {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{Number(item.unit_price).toFixed(2)} each
                        </Typography>
                      </Box>
                      <Typography 
                        variant="h6" 
                        fontWeight={600} 
                        color="primary.main"
                        sx={{ minWidth: 60, textAlign: "right" }}
                      >
                        ₹{Number(item.total_price).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1" fontWeight={500} color="text.primary">Subtotal</Typography>
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      ₹{subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  {cart?.discount_percentage && cart?.discount_percentage > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1" color="success.main" fontWeight={500}>
                        Discount ({formatDiscountPercentage(cart?.discount_percentage || 0)})
                      </Typography>
                      <Typography variant="body1" color="success.main" fontWeight={500}>
                        -₹{discountAmount?.toFixed(2)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" fontWeight={500} color="text.primary">Delivery</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} color={deliveryCharges === 0 ? "success.main" : "text.primary"}>
                      <DeliveryDining sx={{ fontSize: 16 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges?.toFixed(2)}`}
                      </Typography>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" fontWeight={700} color="text.primary">Total</Typography>
                    <Typography 
                      variant="h5" 
                      fontWeight={700} 
                      color="primary.main"
                      sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" } }}
                    >
                      ₹{total.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2, p: 2, bgcolor: subtotal >= FREE_DELIVERY_THRESHOLD ? "success.50" : "warning.50", borderRadius: 2 }}>
                  <Typography variant="body2" color={subtotal >= FREE_DELIVERY_THRESHOLD ? "success.main" : "warning.main"} fontWeight={500}>
                    <CheckCircle sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                    {subtotal >= FREE_DELIVERY_THRESHOLD 
                      ? "Free delivery on orders over ₹100. Yours qualifies!" 
                      : `Add ₹${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more for free delivery!`
                    }
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Payment />}
              onClick={handlePlaceOrder}
              disabled={processing || !formData.shippingAddress.trim() || authLoading}
              sx={{
                borderRadius: 3,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "all 0.2s ease",
                bgcolor: "primary.main",
                "&:hover": { 
                  bgcolor: "primary.dark",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  transform: "translateY(-1px)"
                },
                "&:disabled": {
                  bgcolor: "grey.300",
                  color: "grey.500",
                  boxShadow: "none",
                  transform: "none"
                }
              }}
            >
              {processing ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={24} color="inherit" />
                  <Typography>Placing Order...</Typography>
                </Box>
              ) : (
                `Place Order • ₹${total.toFixed(2)}`
              )}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                By placing your order, you agree to our Terms of Service
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
