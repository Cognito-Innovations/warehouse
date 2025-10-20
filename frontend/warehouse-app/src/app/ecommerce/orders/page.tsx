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
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack,
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Order } from "../../../types/ecommerce";
import { ecommerceService } from "../../../services/ecommerce.service";

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
      return <ShoppingCart />;
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
      return <ShoppingCart />;
  }
};

export default function OrdersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await ecommerceService.getOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/ecommerce/orders/${orderId}`);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
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
            onClick={() => router.push("/ecommerce")}
            sx={{ mb: 2, textTransform: "none" }}
          >
            Back to Shopping
          </Button>
          <Typography variant="h4" fontWeight="bold">
            My Orders
          </Typography>
        </Box>

        {orders.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <ShoppingCart sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start shopping to see your orders here
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/ecommerce")}
              sx={{ textTransform: "none" }}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Order #{order.order_number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status.replace("_", " ")}
                        color={getStatusColor(order.status) as any}
                        variant="filled"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Items
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {order.items.length} item(s)
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{order.total_amount.toFixed(0)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Payment Status
                        </Typography>
                        <Chip
                          label={order.payment_status}
                          color={order.payment_status === "PAID" ? "success" : "warning"}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Order Status
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {order.status.replace("_", " ")}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Order Items Preview */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Items:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {order.items.slice(0, 3).map((item) => (
                          <Chip
                            key={item.id}
                            label={`${item.product.name} (${item.quantity})`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <Chip
                            label={`+${order.items.length - 3} more`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewOrder(order.id)}
                      sx={{ textTransform: "none" }}
                    >
                      View Details
                    </Button>
                    {order.status === "PENDING" && (
                      <Button
                        variant="text"
                        color="error"
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          // Handle cancel order
                          console.log("Cancel order:", order.id);
                        }}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
