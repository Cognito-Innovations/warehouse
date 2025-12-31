"use client";
import React from "react";
import { useSession } from "next-auth/react";

import OrdersHeader from "@/components/ecommerce/order/OrdersHeader";
import OrdersContent from "@/components/ecommerce/order/OrdersContent";

export default function Orders() {
  const { data: session } = useSession();
  const user_id = (session?.user as any)?.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <OrdersHeader />
      <OrdersContent userId={user_id} />
    </div>
  );
}