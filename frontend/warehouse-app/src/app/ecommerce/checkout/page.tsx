"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
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
import { fetchUserAddresses } from "@/lib/api.service";
import { getCurrencyForCountry } from "@/utils/currency";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import { parsePrice, formatPrice } from "@/utils/priceUtils";

interface UserAddress {
  address: string;
  city: string;
  country: string;
  zip_code: string;
  state?: string;
  name?: string;
  phone_number?: string;
  email?: string;
}

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
  const [fetchedAddress, setFetchedAddress] = useState<UserAddress | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const locationData = useEffectiveUserLocation({
    country: 'United States of America',
    city: 'New York',
    pincode: '10001',
  });
  const selectedCountry = locationData.location.country;

  const currency = getCurrencyForCountry(selectedCountry);
  const currencyStr = currency.symbol;

  const getThresholdAndFees = (country: string) => {
    if (country.includes('India')) {
      return { threshold: 299, deliveryFee: 3, serviceCharge: 1 };
    } else {
      return { threshold: 20, deliveryFee: 5, serviceCharge: 1 };
    }
  };

  const calculateSelectedTotals = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return { subtotal: 0, discount: 0, deliveryFee: 0, taxes: 0, serviceCharge: 0, total: 0 };
    }

    const { threshold, deliveryFee: deliveryBase, serviceCharge: serviceBase } = getThresholdAndFees(selectedCountry);

    // Calculate subtotal from ALL items in cart, using Number for prices
    const subtotal = cart.items.reduce((sum, item) => {
      const itemUnitPrice = Number(item.unit_price) || 0;
      const itemLineTotal = (item.quantity || 0) * itemUnitPrice;
      return sum + itemLineTotal;
    }, 0);

    const discountAmount = Number(cart.discount_percentage) || 0;
    const deliveryFee = subtotal >= threshold ? 0 : deliveryBase;
    const taxes = subtotal * 0.02; // 2% tax
    const serviceCharge = serviceBase;
    const total = subtotal - discountAmount + deliveryFee + taxes + serviceCharge;

    return {
      subtotal: isNaN(subtotal) ? 0 : subtotal,
      discount: isNaN(discountAmount) ? 0 : discountAmount,
      deliveryFee: isNaN(deliveryFee) ? 0 : deliveryFee,
      taxes: isNaN(taxes) ? 0 : taxes,
      serviceCharge: isNaN(serviceCharge) ? 0 : serviceCharge,
      total: isNaN(total) ? 0 : total,
    };
  };

  const totals = calculateSelectedTotals();
  const threshold = getThresholdAndFees(selectedCountry).threshold;
  const currencyInfo = getCurrencyForCountry(selectedCountry);
  const currencySymbol = cart?.items.length! > 0 ? parsePrice(cart?.items[0].product.price!).currency : currencyInfo.symbol;

  const formatLocalPrice = (amount: number) => formatPrice(amount, currencySymbol);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const fetchUserAddress = async () => {
    if (!user?.id) {
      setFetchedAddress(null);
      setAddressLoading(false);
      return;
    }

    try {
      setAddressLoading(true);
      setError(null);

      const addressData = await fetchUserAddresses(user.id);

      let addresses: UserAddress[] = [];
      if (Array.isArray(addressData)) {
        addresses = addressData;
      } else if (addressData) {
        addresses = [addressData];
      }

      if (addresses.length > 0) {
        const defaultAddress = addresses[0];
        const fullAddress = `${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.state || ''}, ${defaultAddress.zip_code}, ${defaultAddress.country}`;
        setFormData(prev => ({
          ...prev,
          shippingAddress: fullAddress,
        }));
        setFetchedAddress(defaultAddress);
      } else {
        setFetchedAddress(null);
        setError("No saved address found. Please add an address in your profile.");
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      setFetchedAddress(null);
      setError("Failed to fetch your saved address. Please try again.");
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, [user?.id]);

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
      
      if (formData.shippingAddress) { 
        handlePlaceOrder();
      }
    
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("shouldPlaceOrderAfterLogin");
    }
  }, [user, cart, formData.shippingAddress]);

  const handlePlaceOrder = async () => {
    if (!cart) return;

    if (authLoading) {
      return;
    }

    if (!user) {
      localStorage.setItem("pendingOrder", JSON.stringify({}));
      localStorage.setItem("shouldPlaceOrderAfterLogin", "true");
  
      toast.info("Please sign in to place your order");
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent("/ecommerce/checkout")}`);
      return;
    }

    if (!formData.shippingAddress) {
      setError("Cannot place order without a shipping address.");
      toast.error("No shipping address found.");
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
            bgcolor: "primary.main",
            color: "white",
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
                    
                    {addressLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 3, bgcolor: 'grey.50', borderRadius: 2, minHeight: '140px', justifyContent: 'center' }}>
                        <CircularProgress size={24} sx={{ mr: 2 }} />
                        <Typography color="text.secondary">Fetching your address...</Typography>
                      </Box>
                    ) : fetchedAddress ? (
                      <Box
                        sx={{
                          p: { xs: 2, md: 2.5 },
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <Typography variant="body1" fontWeight={500} color="text.primary" gutterBottom>
                          {fetchedAddress.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fetchedAddress.city}, {fetchedAddress.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fetchedAddress.zip_code}
                        </Typography>
                      </Box>
                    ) : (
                       !error && !authLoading && (
                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                          No saved address found. Please add an address to your profile to proceed.
                        </Alert>
                       )
                    )}
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
                  {cart?.items.map((item) => {
                    const parsedUnit = parsePrice(item.unit_price || '0');
                    const unitRaw = parsedUnit.raw;
                    const parsedItemTotal = parsePrice(item.total_price || '0');
                    const itemTotalRaw = parsedItemTotal.raw;
                    return (
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
                            {formatLocalPrice(unitRaw)} each
                          </Typography>
                        </Box>
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          color="primary.main"
                          sx={{ minWidth: 60, textAlign: "right" }}
                        >
                          {formatLocalPrice(itemTotalRaw)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1" fontWeight={500} color="text.primary">Subtotal</Typography>
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {formatLocalPrice(totals.subtotal)}
                    </Typography>
                  </Box>
                  
                  {cart?.discount_percentage && cart?.discount_percentage > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1" color="success.main" fontWeight={500}>
                        Item Discounts
                      </Typography>
                      <Typography variant="body1" color="success.main" fontWeight={500}>
                        -{formatLocalPrice(totals.discount)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" fontWeight={500} color="text.primary">Delivery</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} color={totals.deliveryFee === 0 ? "success.main" : "text.primary"}>
                      <DeliveryDining sx={{ fontSize: 16 }} />
                      <Typography variant="body2" fontWeight={600}>
                        {totals.deliveryFee === 0 ? "FREE" : formatLocalPrice(totals.deliveryFee)}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1" fontWeight={500} color="text.primary">Taxes (2%)</Typography>
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {formatLocalPrice(totals.taxes)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1" fontWeight={500} color="text.primary">Service Charge</Typography>
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {formatLocalPrice(totals.serviceCharge)}
                    </Typography>
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
                      {formatLocalPrice(totals.total)}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2, p: 2, bgcolor: totals.subtotal >= threshold ? "success.50" : "warning.50", borderRadius: 2 }}>
                  <Typography variant="body2" color={totals.subtotal >= threshold ? "success.main" : "warning.main"} fontWeight={500}>
                    <CheckCircle sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                    {totals.subtotal >= threshold 
                      ? `Free delivery on orders over ${formatLocalPrice(threshold)}. Yours qualifies!` 
                      : `Add ${formatLocalPrice(threshold - totals.subtotal)} more for free delivery!`
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
              disabled={processing || !formData.shippingAddress.trim() || authLoading || addressLoading}
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
                `Place Order • ${formatLocalPrice(totals.total)}`
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