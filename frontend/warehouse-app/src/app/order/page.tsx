"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import { ShoppingBag as ShoppingBagIcon } from "@mui/icons-material";

import { getOrdersByUser } from "@/lib/api.service";
import TabPanel from "../../components/AssistedShopping/TabPanel";
import EmptyState from "../../components/AssistedShopping/EmptyState";
import RequestPagination from "../../components/AssistedShopping/RequestPagination";
import OrderList from "@/components/ecommerce/OrderList";

export default function Orders() {
  const { data: session, status } = useSession();
  
  const [value, setValue] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const user_id = (session?.user as any)?.user_id;

  const fetchOrders  = async () => {
    if (!user_id) return;

    setIsLoading(true);
    try {
      const data = await getOrdersByUser(user_id);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && user_id) {
      fetchOrders();
    }
  }, [user_id, status]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg min-h-[400px]">
          <TabPanel value={value} index={0}>
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <CircularProgress />
                </div>
              ) : orders.length > 0 ? (
                <>
                  <OrderList orders={orders} />

                  <RequestPagination count={orders.length} />
                </>
              ) : (
                <EmptyState
                  icon={<ShoppingBagIcon />}
                  message="No Orders Available"
                />
              )}
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}
