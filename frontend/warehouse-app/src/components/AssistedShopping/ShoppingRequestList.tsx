"use client";
import React from "react";
import { ShoppingBag as ShoppingBagIcon } from "@mui/icons-material";

import ShoppingRequestItem from "./ShoppingRequestItem";
import EmptyState from "./EmptyState";

interface ShoppingRequestListProps {
  shoppingRequests: any[];
  searchTerm: string;
  onDeleteClick: (id: string) => void;
}

export default function ShoppingRequestList({
  shoppingRequests,
  searchTerm,
  onDeleteClick
}: ShoppingRequestListProps) {
  
  const filteredRequests = shoppingRequests.filter((request) => {
    if (!request.request_code) return false;
    return request.request_code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (filteredRequests.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBagIcon />}
        message="No matching requests found"
      />
    );
  }

    const NON_DELETABLE_STATUSES = ["PAYMENT_APPROVED", "ORDER_PLACED"];

  return (
    <div className="space-y-4">
      {filteredRequests.map((request) => {
        return (
          <ShoppingRequestItem
            key={request.request_code || request.id}
            request={request}
            onDeleteClick={onDeleteClick}
            NON_DELETABLE_STATUSES={NON_DELETABLE_STATUSES}
          />
        );
      })}
    </div>
  );
}