"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress, Container, Button } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import { getOrdersByUser } from "@/lib/api.service";
import EmptyState from "@/components/AssistedShopping/EmptyState";
import OrderCard from "./OrderCard";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";

interface OrdersContentProps {
  userId?: string;
}

export default function OrdersContent({ userId }: OrdersContentProps) {
  const { status } = useSession();
  const router = useRouter();
 
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await getOrdersByUser(userId);
      setOrders(data.filter(order => order.items && order.items.length > 0));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && userId) {
      fetchOrders();
    }
  }, [userId, status]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        maxWidth: {
          xs: "100%",
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: ecommerceData.ui.spacing.containerMaxWidth,
        },
        mx: "auto",
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <CircularProgress />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={`ecommerce-order-card-${order.id}`} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
          }
          message="No Orders Available"
          actionButton={
            <Button
              variant="contained"
              onClick={() => router.push(ROUTES.ECOMMERCE)}
              sx={{
                textTransform: "none",
                px: 4,
                py: 1.5,
              }}
            >
              Start Shopping
            </Button>
          }
        />
      )}
    </Container>
  );
}