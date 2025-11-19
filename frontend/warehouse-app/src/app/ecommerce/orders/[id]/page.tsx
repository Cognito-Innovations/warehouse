"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  LocalShipping,
  CheckCircle,
  Cancel,
  Payment,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Order } from "../../../../types/ecommerce";
import { ecommerceService } from "../../../../services/ecommerce.service";
import { ROUTES } from "@/utils/constants";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "CONFIRMED":
    case "PROCESSING":
      return "info";
    case "SHIPPED":
      return "primary";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
    case "REFUNDED":
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Payment />;
    case "CONFIRMED":
    case "PROCESSING":
      return <LocalShipping />;
    case "SHIPPED":
      return <LocalShipping />;
    case "DELIVERED":
      return <CheckCircle />;
    case "CANCELLED":
    case "REFUNDED":
      return <Cancel />;
    default:
      return <Payment />;
  }
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await ecommerceService.getOrder(params.id);
      setOrder(orderData);
    } catch (err) {
      console.error("Error loading order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Order not found"}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push(ROUTES.ORDER)}
            sx={{ mb: 2, textTransform: "none" }}
          >
            Back to Orders
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Order Details
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Order #{order.order_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
                <Chip
                  icon={getStatusIcon(order.status)}
                  label={order.status.replace("_", " ")}
                  color={getStatusColor(order.status) as any}
                  variant="filled"
                  size="large"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Items */}
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Items
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                              src={item.product.image_url}
                              alt={item.product.name}
                              variant="rounded"
                              sx={{ width: 50, height: 50 }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {item.product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.product.quantity} {item.product.measurement || "units"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ₹{item.unit_price.toFixed(0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            ₹{item.total_price.toFixed(0)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Delivery Information */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Delivery Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body1">
                    {order.shipping_address || "Not provided"}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Billing Address
                  </Typography>
                  <Typography variant="body1">
                    {order.billing_address || "Same as shipping address"}
                  </Typography>
                </Grid>
                
                {order.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Special Instructions
                    </Typography>
                    <Typography variant="body1">
                      {order.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Order Summary Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              
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
                  <Typography variant="body2">₹{order.subtotal.toFixed(0)}</Typography>
                </Box>
                
                {order.discount_percentage > 0 && (
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
                      -₹{order.discount_percentage.toFixed(0)}
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

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">₹{order.tax_amount.toFixed(0)}</Typography>
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
                    ₹{order.total_amount.toFixed(0)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Payment Status
                </Typography>
                <Chip
                  label={order.payment_status}
                  color={order.payment_status === "PAID" ? "success" : "warning"}
                  variant="filled"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Order Status
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {order.status.replace("_", " ")}
                </Typography>
              </Box>

              {order.status === "PENDING" && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  sx={{ textTransform: "none", mt: 2 }}
                  onClick={() => {
                    // Handle cancel order
                    console.log("Cancel order:", order.id);
                  }}
                >
                  Cancel Order
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
