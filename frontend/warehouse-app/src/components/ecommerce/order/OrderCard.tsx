"use client";
import React from "react";
import { getStatusColor, STATUS_ICONS } from "@/lib/orderStatus";
import { orderStatusPhrases } from "@/utils/constants";

interface OrderCardProps {
  order: any;
  item: any;
}

export default function OrderCard({ order, item }: OrderCardProps) {
  const product = item.product || {};

  const currency = order.display_currency;
  const statusUpper = order.status?.toUpperCase();
  const IconComponent = STATUS_ICONS[statusUpper]?.Icon;

  const statusPhrase = orderStatusPhrases[order.status] || order.status.charAt(0).toUpperCase() + order.status.slice(1);

  const statusColor = getStatusColor(order.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
        {/* LEFT: Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border bg-gray-50">
            <img
              src={product.image_url || "/placeholder-product.jpg"}
              alt={product.name || "Product"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* CENTER: Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
            {product.name || "Product"}
          </h3>

          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Qty: {item.quantity}
            </span>

            <span className="text-sm sm:text-base font-bold text-gray-900">
              {currency}
              {item.unit_price?.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Order number (mobile) */}
          <div className="mt-1 text-xs text-gray-500 sm:hidden truncate">
            {order.order_number}
          </div>
        </div>

        {/* RIGHT: Status */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:min-w-[120px]">
          <div className="flex items-center gap-1">
            {IconComponent && (
              <IconComponent className={`w-4 h-4 ${statusColor}`} />
            )}
            <span className={`text-xs sm:text-sm font-medium ${statusColor}`}>
              {statusPhrase}
            </span>
          </div>

          {/* Order number (desktop) */}
          <div className="hidden sm:block text-xs text-gray-500 truncate">
            {order.order_number}
          </div>
        </div>
      </div>
    </div>
  );
}