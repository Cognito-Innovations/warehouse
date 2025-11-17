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
import { toast } from "sonner";

import { useCart, useCartActions } from "../../../store/ecommerceStore";
import { useAuth } from "@/contexts/AuthContext";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import { ecommerceService } from "../../../services/ecommerce.service";
import { launchCashfreePayment } from "../../../services/cashfree-payment.service";
import OrderSuccessPopup from "@/components/ecommerce/OrderSuccessPopup";
import { ROUTES } from "@/utils/constants";
import { fetchUserAddresses } from "@/lib/api.service";
import { getCurrencyForCountry } from "@/utils/currency";
import { formatPrice, getCartItemPricingSummary } from "@/utils/priceUtils";
import { CartItem } from "@/types/ecommerce";

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
  const [checkedOutItems, setCheckedOutItems] = useState<CartItem[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);

  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const selectedCountry = locationData.location.countryName;
  const countryCode = locationData.location.countryCode;

  const countryName = selectedCountry || '';
  const getThresholdAndFees = (country?: string) => {
    if (country && country.includes('India')) {
      return { threshold: 299, deliveryFee: 3, serviceCharge: 1 };
    } else {
      return { threshold: 20, deliveryFee: 5, serviceCharge: 1 };
    }
  };

  const calculateSelectedTotals = () => {
    if (!checkedOutItems || checkedOutItems.length === 0) {
      return { subtotal: 0, discount: 0, deliveryFee: 0, taxes: 0, serviceCharge: 0, total: 0 };
    }

    const { threshold, deliveryFee: deliveryBase, serviceCharge: serviceBase } =
      getThresholdAndFees(countryName);

    let grossSubtotal = 0;
    let discountAmount = 0;

    checkedOutItems.forEach((item: CartItem) => {
      const pricing = getCartItemPricingSummary(item);
      grossSubtotal += pricing.originalUnitPrice * pricing.quantity;
      discountAmount += pricing.discountTotal;
    });

    const discountedSubtotal = grossSubtotal - discountAmount;
    const deliveryFee = discountedSubtotal >= threshold ? 0 : deliveryBase;
    const taxes = discountedSubtotal * 0.02; // 2% tax
    const serviceCharge = serviceBase;
    const total = discountedSubtotal + deliveryFee + taxes + serviceCharge;
    const asAmount = (value: number) => Number(value.toFixed(2));

    return {
      subtotal: asAmount(grossSubtotal),
      discount: asAmount(discountAmount),
      deliveryFee: asAmount(deliveryFee),
      taxes: asAmount(taxes),
      serviceCharge: asAmount(serviceCharge),
      total: asAmount(total),
    };
  };

  const totals = calculateSelectedTotals();
  const currencyInfo = getCurrencyForCountry(countryName);
  const currencySymbol =
    (checkedOutItems?.length ?? 0) > 0
      ? getCartItemPricingSummary(checkedOutItems[0]).currency || currencyInfo.symbol
      : currencyInfo.symbol;

  const formatLocalPrice = (amount: number) => formatPrice(amount, currencySymbol);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const selectedItemsRaw = localStorage.getItem("checkoutSelectedItems");
    if (selectedItemsRaw) {
      try {
        const selectedItems: CartItem[] = JSON.parse(selectedItemsRaw);
        setCheckedOutItems(selectedItems);
        localStorage.removeItem("checkoutSelectedItems");
      } catch (err) {
        setCheckedOutItems([]);
      }
    } else if (cart?.items?.length! > 0) {
      setCheckedOutItems(cart?.items!);
    }
    setItemsLoaded(true);
  }, [cart]);

  useEffect(() => {
    if (
      itemsLoaded &&
      (!checkedOutItems || checkedOutItems.length === 0) &&
      !isOrderSuccessModalOpen
    ) {
      router.replace(ROUTES.CART);
    }
  }, [checkedOutItems, isOrderSuccessModalOpen, router, itemsLoaded]);

  useEffect(() => {
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

    if (user?.id) {
      fetchUserAddress();
    }
  }, [user?.id]);

  async function handlePaymentAndOrder() {
    if (!checkedOutItems.length || !formData.shippingAddress || authLoading) {
      setError("No items found for checkout.");
      toast.error("No items to checkout.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const orderData = {
        shipping_address: formData.shippingAddress,
        country_code: countryCode,
      }
      const initiateResponse = await ecommerceService.initiateOrder(orderData);
      const { orderId, orderNumber, paymentSessionId, totalAmount } = initiateResponse;

      if (!paymentSessionId) {
        throw new Error('Failed to initiate payment');
      }

      const paymentConfig = {
        orderId: orderNumber,
        orderAmount: totalAmount,
        orderCurrency: currencySymbol,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
        orderToken: paymentSessionId,
      };

      await launchCashfreePayment(
        paymentConfig,
        async (paymentResult: any) => {
          try {
            await ecommerceService.updatePaymentStatus(orderId, 'PAID');
            clearCart();
            setIsOrderSuccessModalOpen(true);
            toast.success("Order placed successfully!");
          } catch (error) {
            setError("Payment succeeded but order update failed. Contact support.");
            toast.error("Order update error");
          }
        },
        (failData: any) => {
          setError(failData?.reason || "Payment failed. Please try again.");
          toast.error(failData?.reason || "Payment cancelled");
        }
      )
    } catch (err) {
      setError(err.message || "Failed to initiate checkout.");
      toast.error("Checkout initiation failed");
    } finally {
      setProcessing(false);
    }
  }

  const handleContinueShopping = () => {
    setIsOrderSuccessModalOpen(false);
    router.push(ROUTES.ECOMMERCE);
  };

  const handleViewOrderHistory = () => {
    setIsOrderSuccessModalOpen(false);
    router.push(ROUTES.ORDER_HISTORY);
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

  if ((!checkedOutItems || checkedOutItems.length === 0) && !isOrderSuccessModalOpen) {
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
                label={checkedOutItems.length} 
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
        onViewOrderHistory={handleViewOrderHistory}
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
                  Get it delivered in 2-3 days*
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
                          secondary="Typically within 2-3 days" 
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
                  {checkedOutItems.map((item: CartItem) => {
                    const pricing = getCartItemPricingSummary(item);
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
                            {formatLocalPrice(pricing.discountedUnitPrice)} each
                          </Typography>
                        </Box>
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          color="primary.main"
                          sx={{ minWidth: 60, textAlign: "right" }}
                        >
                          {formatLocalPrice(pricing.lineTotal)}
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
                  
                  {totals.discount > 0 && (
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
                        {formatLocalPrice(totals.deliveryFee)}
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
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Payment />}
              onClick={handlePaymentAndOrder}
              disabled={processing || !formData.shippingAddress.trim() || authLoading || addressLoading || checkedOutItems.length === 0}
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
                  <Typography>Processing Payment...</Typography>
                </Box>
              ) : (
                `Pay & Place Order • ${formatLocalPrice(totals.total)}`
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