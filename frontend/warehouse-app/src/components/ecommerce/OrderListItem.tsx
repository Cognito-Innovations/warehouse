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
  const firstItem = items[0];

  const currency = order.display_currency;

  if (!order?.order_number) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex-shrink-0">
        {firstItem && firstItem.product?.image_url ? (
          <div className="relative">
            <img
              src={firstItem.product.image_url}
              alt={firstItem.product.name || 'Product'}
              className="w-16 h-16 rounded-md object-cover border border-gray-100"
            />
            {itemCount > 1 && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                +{itemCount - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
        {items.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 text-center max-w-[80px] line-clamp-2">
            {items.map(item => item.product?.name || 'Product').join(', ')}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-lg font-semibold text-gray-900">
          {currency}{order.total_amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
        </div>
      </div>

      <div className="flex flex-col items-end space-y-1 text-right min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">
          {order.order_number}
        </p>
        <p className="text-xs text-gray-500">
          {formatDateTime(order.created_at)}
        </p>
        <div className="flex items-center space-x-1 pt-1">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-600">{order.status}</span>
        </div>

        {order.comment && (
          <p className="text-xs text-gray-400 mt-1 max-w-[120px] truncate italic">
            {order.comment}
          </p>
        )}
      </div>
    </div>
  );
}