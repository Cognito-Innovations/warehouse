"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button, CircularProgress, Card, CardContent, Divider } from "@mui/material";
import { CheckCircle, ArrowForward } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ecommerceService } from "@/services/ecommerce.service";
import { ROUTES } from "@/utils/constants";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      setError("Invalid order reference.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderData = await ecommerceService.getOrderByNumber(orderNumber);
        setOrder(orderData);
      } catch (err) {
        setError("Failed to load order details.");
        toast.error("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">{error || "Order not found."}</Typography>
        <Button variant="contained" onClick={() => router.push(ROUTES.CART)} sx={{ mt: 2 }}>
          Back to Cart
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="sm">
        <Card sx={{ textAlign: "center", p: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
          <Typography variant="h4" fontWeight={600} gutterBottom color="success.main">
            Payment Successful!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Thank you for your order. Your items are on the way!
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography variant="h6" gutterBottom>Order Details</Typography>
            <Typography><strong>Order Number:</strong> {order.order_number}</Typography>
            <Typography><strong>Total:</strong> ${order.total_amount?.toFixed(2)} (or local equiv.)</Typography>
            <Typography><strong>Status:</strong> {order.status}</Typography>
            <Typography><strong>Shipping to:</strong> {order.shipping_address}</Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => router.push(ROUTES.ORDER_HISTORY)}
            sx={{ width: "100%", py: 1.5 }}
          >
            View Your Orders
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => router.push(ROUTES.CART)}
            sx={{ mt: 2, width: "100%" }}
          >
            Continue Shopping
          </Button>
        </Card>
      </Container>
    </Box>
  );
}