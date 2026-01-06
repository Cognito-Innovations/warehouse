"use client";
import React from "react";
import { useSession } from "next-auth/react";

import OrdersContent from "@/components/ecommerce/order/OrdersContent";

export default function Orders() {
  const { data: session } = useSession();
  const user_id = (session?.user as any)?.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <OrdersContent userId={user_id} />
    </div>
  );
}