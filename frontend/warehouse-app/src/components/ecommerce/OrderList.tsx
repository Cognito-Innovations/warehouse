"use client";
import React from "react";
import { ShoppingBag as ShoppingBagIcon } from "@mui/icons-material";

import OrderListItem from "./OrderListItem";
import EmptyState from "../AssistedShopping/EmptyState";

interface OrderListProps {
  orders: any[];
}

export default function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBagIcon />}
        message="No orders found"
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        return (
          <OrderListItem
            key={order.id}
            order={order}
          />
        );
      })}
    </div>
  );
}