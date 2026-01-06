"use client";
import React from "react";
import { getStatusColor, STATUS_ICONS } from "@/lib/orderStatus";
import { orderStatusPhrases } from "@/utils/constants";

interface OrderCardProps {
  order: any;
}

export default function OrderCard({ order }: OrderCardProps) {
  const items = order.items || [];
  if (items.length === 0) return null;

  const firstItem = items[0];
  const product = firstItem.product || {};
  const currency = order.display_currency;
  const statusUpper = order.status?.toUpperCase();
  const IconComponent = STATUS_ICONS[statusUpper]?.Icon;

  const statusPhrase = orderStatusPhrases[order.status] || order.status.charAt(0).toUpperCase() + order.status.slice(1);

  const statusColor = getStatusColor(order.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-3 sm:p-4 flex flex-row items-center gap-3 sm:gap-4">
        {/* Left: Image and Product Name */}
        <div className="flex flex-col items-center sm:items-start flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={product.image_url || "/placeholder-product.jpg"}
              alt={product.name || "Product"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <h3 className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-gray-900 text-center sm:text-left line-clamp-2 max-w-[80px] sm:max-w-none">
            {product.name || "Product"}
          </h3>
        </div>

        {/* Center: Quantity and Price */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left min-w-0">
          <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Qty: {firstItem.quantity}
          </div>
          <div className="mt-1 sm:mt-2 text-sm sm:text-base font-bold text-gray-900">
            {currency}
            {firstItem.unit_price?.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            }) || "0.00"}
          </div>
        </div>

        {/* Right: Order Number and Status with Icon */}
        <div className="flex flex-col items-end flex-shrink-0 text-right min-w-[70px] sm:min-w-[100px]">
          <div className="flex items-center justify-end gap-1 mb-1 sm:mb-2">
            {IconComponent && (
              <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 ${statusColor}`} />
            )}
            <span className={`text-xs sm:text-sm font-medium ${statusColor}`}>
              {statusPhrase}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">
            {order.order_number}
          </span>
        </div>
      </div>
    </div>
  );
}