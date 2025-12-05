"use client";
import React from "react";

import { formatDateTime } from "@/lib/utils";
import { STATUS_ICONS } from "@/lib/orderStatus";

interface OrderListItemProps {
  order: any;
}

export default function OrderListItem({ order }: OrderListItemProps) {
  const statusMeta = STATUS_ICONS[order.status] || STATUS_ICONS.PENDING;
  const { Icon } = statusMeta;

  const items = order.items || [];
  const itemCount = items.length;

  let itemDisplay: string;

  if (itemCount === 0) {
    itemDisplay = "0 Items";
  } else if (itemCount === 1) {
    const item = items[0];
    const productName = item.product?.name || 'Product';
    const quantity = item.quantity;

    const capitalizedName = productName.charAt(0).toUpperCase() + productName.slice(1);

    itemDisplay = `${capitalizedName} x ${quantity}`;
  } else {
    itemDisplay = `${itemCount} Items`;
  }

  if (!order?.order_number) {
    return null;
  }

  return (
    <div
      key={order.id}
      className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between"
    >
      <div className="flex flex-col space-y-1">
        <p className="font-semibold text-gray-900">
          {order.order_number}
        </p>
        <p className="text-sm text-gray-600">
          {formatDateTime(order.created_at)}
        </p>
      </div>

      <div className="flex flex-col items-end space-y-1">
        <p className="font-semibold text-gray-900">
          Total: {order.display_currency || '$'}{(order.total_amount || 0)}
        </p>
        
        <p className="text-sm text-gray-600">
          {itemDisplay}
        </p>

        <div className="flex items-center space-x-2 pt-1">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium">{order.status}</span>
        </div>
      </div>
    </div>
  );
}