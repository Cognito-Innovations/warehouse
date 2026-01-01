"use client";
import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  actionButton?: React.ReactNode;
}

export default function EmptyState({ icon, message, actionButton }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
      <div className="text-6xl text-gray-300 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-600 mb-4">{message}</h3>
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
}